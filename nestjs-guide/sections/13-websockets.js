export default {
  title: "WebSockets",
  desc: "Comunicación en tiempo real con Socket.IO, Gateways, identificación de clientes, autenticación JWT en el handshake y manejo de usuarios duplicados.",
  lectures: [
    {
      heading: "WebSocket Gateways — setup inicial",
      body: `
<p>En NestJS, los WebSockets se implementan con <strong>Gateways</strong>. Un Gateway es una clase decorada con <code>@WebSocketGateway()</code> que actúa como el equivalente a un controlador pero para eventos de socket.</p>
<p>NestJS soporta Socket.IO (por defecto) y WebSockets nativos. Socket.IO agrega reconexión automática, namespaces y rooms — lo más común en producción.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar dependencias",
        content: `npm install @nestjs/websockets @nestjs/platform-socket.io socket.io`
      },
      code2: {
        lang: "typescript",
        label: "messages.gateway.ts — estructura básica",
        content: `<span class="kw">import</span> {
  WebSocketGateway, WebSocketServer,
  OnGatewayConnection, OnGatewayDisconnect,
} <span class="kw">from</span> <span class="str">'@nestjs/websockets'</span>;
<span class="kw">import</span> { Server, Socket } <span class="kw">from</span> <span class="str">'socket.io'</span>;

<span class="dec">@WebSocketGateway</span>({ cors: <span class="kw">true</span> })
<span class="kw">export class</span> <span class="tp">MessagesGateway</span> <span class="kw">implements</span> <span class="tp">OnGatewayConnection</span>, <span class="tp">OnGatewayDisconnect</span> {
  <span class="dec">@WebSocketServer</span>()
  wss: <span class="tp">Server</span>;

  handleConnection(client: <span class="tp">Socket</span>) {
    console.log(<span class="str">\`Cliente conectado: \${client.id}\`</span>);
  }

  handleDisconnect(client: <span class="tp">Socket</span>) {
    console.log(<span class="str">\`Cliente desconectado: \${client.id}\`</span>);
  }
}`
      }
    },
    {
      heading: "Escuchar y emitir eventos",
      body: `
<p><code>@SubscribeMessage('eventName')</code> escucha un evento del cliente. El servidor puede responder de varias formas:</p>
<ul>
  <li><strong>Return value</strong> — responde solo al emisor (ACK)</li>
  <li><code>client.emit('event', data)</code> — responde solo al emisor</li>
  <li><code>this.wss.emit('event', data)</code> — broadcast a todos los clientes</li>
  <li><code>client.broadcast.emit('event', data)</code> — todos excepto el emisor</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "Recibir mensaje y hacer broadcast",
        content: `<span class="kw">import</span> { SubscribeMessage, MessageBody } <span class="kw">from</span> <span class="str">'@nestjs/websockets'</span>;

<span class="dec">@SubscribeMessage</span>(<span class="str">'message-from-client'</span>)
handleMessageFromClient(
  <span class="dec">@ConnectedSocket</span>() client: <span class="tp">Socket</span>,
  <span class="dec">@MessageBody</span>() payload: <span class="tp">NewMessageDto</span>,
) {
  <span class="cm">// Broadcast a todos incluyendo al emisor</span>
  <span class="kw">this</span>.wss.emit(<span class="str">'message-from-server'</span>, {
    fullName: <span class="kw">this</span>.messagesService.getUserFullName(client.id),
    message: payload.message,
  });
}`
      }
    },
    {
      heading: "Mantener clientes identificados",
      body: `
<p>Socket.IO asigna un <code>id</code> único a cada conexión, pero ese ID cambia en cada reconexión. Para identificar al usuario entre sesiones, mantén un mapa en el servicio: <code>socketId → user</code>.</p>
      `,
      code: {
        lang: "typescript",
        label: "messages.service.ts — registro de clientes",
        content: `<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">MessagesService</span> {
  <span class="kw">private</span> connectedClients: Record&lt;<span class="tp">string</span>, <span class="tp">ConnectedClient</span>&gt; = {};

  registerClient(client: <span class="tp">Socket</span>, user: <span class="tp">User</span>) {
    <span class="kw">this</span>.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: <span class="tp">string</span>) {
    <span class="kw">delete this</span>.connectedClients[clientId];
  }

  getConnectedClients(): <span class="tp">number</span> {
    <span class="kw">return</span> Object.keys(<span class="kw">this</span>.connectedClients).length;
  }

  getUserFullName(socketId: <span class="tp">string</span>): <span class="tp">string</span> {
    <span class="kw">return this</span>.connectedClients[socketId]?.user.fullName ?? <span class="str">'Anónimo'</span>;
  }
}`
      }
    },
    {
      heading: "Validar JWT en el handshake",
      body: `
<p>Las rutas HTTP se protegen con guards. Los WebSockets no tienen ese mecanismo — la validación debe hacerse en <code>handleConnection()</code> antes de registrar al cliente.</p>
<p>El cliente envía el JWT en el handshake: <code>auth: { token }</code>. El servidor lo verifica con <code>JwtService.verify()</code>. Si falla, se desconecta al cliente inmediatamente.</p>
      `,
      code: {
        lang: "typescript",
        label: "Validar JWT en handleConnection()",
        content: `<span class="kw">import</span> { JwtService } <span class="kw">from</span> <span class="str">'@nestjs/jwt'</span>;

<span class="kw">async</span> handleConnection(client: <span class="tp">Socket</span>) {
  <span class="kw">const</span> token = client.handshake.headers.authentication <span class="kw">as</span> <span class="tp">string</span>;
  <span class="kw">let</span> payload: <span class="tp">JwtPayload</span>;
  <span class="kw">try</span> {
    payload = <span class="kw">this</span>.jwtService.verify(token);
    <span class="kw">const</span> user = <span class="kw">await</span> userRepository.findOneBy({ id: payload.id });
    <span class="kw">if</span> (!user?.isActive) <span class="kw">throw new</span> <span class="tp">Error</span>();
    <span class="kw">this</span>.messagesService.registerClient(client, user);
  } <span class="kw">catch</span> {
    client.disconnect();
    <span class="kw">return</span>;
  }
  <span class="kw">this</span>.wss.emit(<span class="str">'clients-updated'</span>, <span class="kw">this</span>.messagesService.getConnectedClients());
}`
      },
      callout: { title: "Cliente — enviar el token", text: "En el cliente Vite/JS: const socket = io('http://localhost:3000', { extraHeaders: { authentication: token } })" }
    },
    {
      heading: "Desconectar usuarios duplicados",
      body: `
<p>Si el mismo usuario abre dos pestañas, tiene dos conexiones activas. Para evitar duplicados, al registrar un cliente nuevo, busca si el usuario ya tiene una conexión previa y la desconecta.</p>
      `,
      code: {
        lang: "typescript",
        label: "messages.service.ts — desconectar duplicados",
        content: `registerClient(client: <span class="tp">Socket</span>, user: <span class="tp">User</span>) {
  <span class="cm">// Desconectar sesión previa del mismo usuario</span>
  <span class="kw">const</span> existingSocket = Object.values(<span class="kw">this</span>.connectedClients)
    .find(c => c.user.id === user.id)?.socket;

  <span class="kw">if</span> (existingSocket) existingSocket.disconnect();

  <span class="kw">this</span>.connectedClients[client.id] = { socket: client, user };
}`
      },
      quiz: {
        q: "¿Por qué los WebSocket Gateways no pueden usar AuthGuard() de Passport directamente?",
        options: [
          "Passport no soporta JWT",
          "AuthGuard solo funciona en HTTP — WebSocket no tiene el ciclo de request/response HTTP",
          "Los gateways no pueden inyectar servicios",
          "Socket.IO tiene su propio sistema de guards"
        ],
        correct: 1,
        feedback: "AuthGuard está diseñado para el ciclo de vida HTTP de NestJS (controladores, pipes, guards aplicados al decorador @UseGuards). WebSocket tiene un ciclo distinto — handleConnection() es el punto de entrada, y la validación debe hacerse manualmente ahí antes de aceptar la conexión."
      }
    }
  ]
};
