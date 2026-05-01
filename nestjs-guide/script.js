const SECTIONS = [
  {
    title: "Node.js — El motor",
    desc: "Antes de NestJS necesitas entender Node.js: cómo ejecuta código, cómo maneja archivos y qué significa trabajar de forma asíncrona.",
    lessons: [
      {
        heading: "¿Qué es Node.js?",
        body: `
<p>Node.js es un entorno de ejecución de JavaScript fuera del navegador. Está construido sobre V8, el motor de Chrome, y permite usar JS en el servidor.</p>
<p>Lo más importante que debes saber al inicio:</p>
<ul>
  <li>Node.js es <strong>de un solo hilo</strong>, pero maneja tareas lentas (red, archivos) sin bloquearse.</li>
  <li>Usa un modelo <strong>event loop</strong>: en lugar de esperar, registra un callback y sigue ejecutando.</li>
  <li>Todo lo que hagas en NestJS corre sobre Node.js.</li>
</ul>
        `,
        code: {
          lang: "javascript",
          label: "Ejemplo básico — leer un archivo sin bloquear",
          content: `<span class="kw">const</span> fs = <span class="fn">require</span>(<span class="str">'fs'</span>);

<span class="cm">// Sin bloquear: Node sigue ejecutando mientras lee el archivo</span>
fs.<span class="fn">readFile</span>(<span class="str">'datos.txt'</span>, <span class="str">'utf8'</span>, (err, data) => {
  <span class="kw">if</span> (err) <span class="kw">throw</span> err;
  console.<span class="fn">log</span>(data);
});

console.<span class="fn">log</span>(<span class="str">'Este mensaje aparece ANTES que el archivo'</span>);
<span class="cm">// → "Este mensaje aparece ANTES que el archivo"</span>
<span class="cm">// → (contenido del archivo)</span>`
        },
        callout: { title: "Por qué importa", text: "NestJS es asíncrono por diseño. Si no entiendes que Node no bloquea el hilo, te va a costar depurar errores en producción." },
        quiz: {
          q: "¿Qué imprime primero este código: el console.log después del readFile, o el contenido del archivo?",
          options: ["El contenido del archivo", "El console.log de abajo del readFile", "Los dos al mismo tiempo", "Depende del sistema operativo"],
          correct: 1,
          feedback: "Correcto. Node.js registra la lectura del archivo y sigue ejecutando. El callback se dispara después, cuando el archivo ya está listo."
        }
      },
      {
        heading: "async / await — La forma moderna",
        body: `
<p>Los callbacks son la base, pero el código se vuelve difícil de leer cuando hay muchos anidados. <strong>async/await</strong> es la forma moderna de escribir código asíncrono en Node.js — y es lo que usa NestJS.</p>
<p>La regla es simple:</p>
<ul>
  <li>Una función marcada con <strong>async</strong> siempre devuelve una Promise.</li>
  <li><strong>await</strong> pausa la ejecución <em>dentro</em> de esa función hasta que la Promise se resuelva.</li>
  <li>El resto del programa NO se bloquea.</li>
</ul>
        `,
        code: {
          lang: "javascript",
          label: "Callback vs async/await — mismo resultado, distinta legibilidad",
          content: `<span class="cm">// ❌ Con callbacks — difícil de seguir</span>
<span class="fn">obtenerUsuario</span>(id, (err, user) => {
  <span class="fn">obtenerPedidos</span>(user.id, (err, orders) => {
    <span class="fn">calcularTotal</span>(orders, (err, total) => {
      console.<span class="fn">log</span>(total);
    });
  });
});

<span class="cm">// ✅ Con async/await — se lee como código síncrono</span>
<span class="kw">async function</span> <span class="fn">mostrarTotal</span>(id) {
  <span class="kw">const</span> user   = <span class="kw">await</span> <span class="fn">obtenerUsuario</span>(id);
  <span class="kw">const</span> orders = <span class="kw">await</span> <span class="fn">obtenerPedidos</span>(user.id);
  <span class="kw">const</span> total  = <span class="kw">await</span> <span class="fn">calcularTotal</span>(orders);
  console.<span class="fn">log</span>(total);
}`
        },
        callout: { title: "Dato clave", text: "En NestJS casi todos los métodos de servicios y controladores son async. Verás 'await' en todas partes — saber qué hace es fundamental." },
        quiz: {
          q: "¿Qué hace la palabra clave 'await' dentro de una función async?",
          options: ["Bloquea Node.js completamente hasta que termine", "Pausa solo esa función hasta que la Promise se resuelva", "Convierte código asíncrono en síncrono a nivel global", "Es solo azúcar sintáctico sin efecto real"],
          correct: 1,
          feedback: "Exacto. 'await' pausa la función donde está, pero el event loop sigue corriendo. Node puede atender otras peticiones mientras espera."
        }
      },
      {
        heading: "Módulos en Node.js",
        body: `
<p>En Node.js cada archivo es un módulo. Puedes exportar funciones, clases u objetos desde un archivo e importarlos en otro. Hay dos sistemas:</p>
<ul>
  <li><strong>CommonJS</strong> (el clásico): usa <code>require</code> y <code>module.exports</code>.</li>
  <li><strong>ES Modules</strong> (el moderno): usa <code>import</code> y <code>export</code>. TypeScript — y por ende NestJS — usa este sistema.</li>
</ul>
<p>NestJS compila TypeScript a JavaScript usando ES Modules por debajo, así que en tu código escribirás <code>import</code> y <code>export</code> siempre.</p>
        `,
        code: {
          lang: "typescript",
          label: "Módulos — CommonJS vs ES Modules",
          content: `<span class="cm">// CommonJS (Node clásico)</span>
<span class="kw">const</span> express = <span class="fn">require</span>(<span class="str">'express'</span>);
module.exports = { <span class="fn">saludar</span> };

<span class="cm">// ES Modules / TypeScript (lo que usarás en NestJS)</span>
<span class="kw">import</span> { Injectable } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">export class</span> <span class="tp">AppService</span> {}

<span class="cm">// NestJS importa sus propias herramientas así:</span>
<span class="kw">import</span> {
  Controller,
  Get,
  Post,
} <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;`
        },
        quiz: {
          q: "¿Qué sistema de módulos usa NestJS en el código TypeScript que tú escribes?",
          options: ["CommonJS con require()", "ES Modules con import/export", "AMD modules", "SystemJS"],
          correct: 1,
          feedback: "Correcto. NestJS usa TypeScript que compila a ES Modules. Siempre escribirás import/export, nunca require() en el código de la app."
        }
      }
    ]
  },
  {
    title: "TypeScript — El idioma de NestJS",
    desc: "NestJS está escrito en TypeScript y espera que tú también lo uses. No necesitas ser experto, pero sí dominar tipos, clases, interfaces y decoradores.",
    lessons: [
      {
        heading: "Tipos básicos",
        body: `
<p>TypeScript agrega un sistema de tipos encima de JavaScript. Eso significa que puedes decirle al compilador qué tipo de valor espera cada variable o función, y él te avisará si algo no encaja <strong>antes de ejecutar el código</strong>.</p>
<p>Los tipos más usados en NestJS:</p>
<ul>
  <li><strong>string, number, boolean</strong> — los primitivos.</li>
  <li><strong>object, array</strong> — estructuras de datos.</li>
  <li><strong>void</strong> — una función que no retorna nada.</li>
  <li><strong>Promise&lt;T&gt;</strong> — lo que retorna una función async.</li>
</ul>
        `,
        code: {
          lang: "typescript",
          label: "Tipos básicos en TypeScript",
          content: `<span class="cm">// Tipado de variables</span>
<span class="kw">let</span> nombre: <span class="tp">string</span> = <span class="str">'Ana'</span>;
<span class="kw">let</span> edad: <span class="tp">number</span> = <span class="num">28</span>;
<span class="kw">let</span> activo: <span class="tp">boolean</span> = <span class="kw">true</span>;

<span class="cm">// Tipado de funciones</span>
<span class="kw">function</span> <span class="fn">saludar</span>(nombre: <span class="tp">string</span>): <span class="tp">string</span> {
  <span class="kw">return</span> <span class="str">\`Hola, \${nombre}\`</span>;
}

<span class="cm">// Función async tipada</span>
<span class="kw">async function</span> <span class="fn">buscarUsuario</span>(id: <span class="tp">number</span>): <span class="tp">Promise</span>&lt;<span class="tp">string</span>&gt; {
  <span class="kw">return</span> <span class="str">'usuario encontrado'</span>;
}

<span class="cm">// ❌ Esto da error en tiempo de compilación:</span>
<span class="fn">saludar</span>(<span class="num">42</span>); <span class="cm">// Error: Argument of type 'number' is not assignable to type 'string'</span>`
        },
        callout: { title: "Por qué importa en NestJS", text: "NestJS usa los tipos para hacer validaciones automáticas, generar documentación Swagger y conectar piezas del framework. Sin tipos, pierdes la mitad de los beneficios." },
        quiz: {
          q: "¿Cuándo detecta TypeScript un error de tipos?",
          options: ["Solo en producción", "Solo cuando corres los tests", "En tiempo de compilación, antes de ejecutar", "Nunca, solo da warnings"],
          correct: 2,
          feedback: "Exacto. El compilador de TypeScript (tsc) revisa los tipos antes de generar el JavaScript. El error aparece en tu editor o al compilar."
        }
      },
      {
        heading: "Interfaces y clases",
        body: `
<p>Dos herramientas que usarás constantemente en NestJS:</p>
<ul>
  <li><strong>Interface</strong>: define la forma que debe tener un objeto. Solo existe en TypeScript, desaparece al compilar.</li>
  <li><strong>Class</strong>: define una plantilla para crear objetos. Existe en JavaScript también. NestJS usa clases para casi todo: servicios, controladores, módulos, DTOs.</li>
</ul>
        `,
        code: {
          lang: "typescript",
          label: "Interface vs Class",
          content: `<span class="cm">// Interface — solo describe la forma</span>
<span class="kw">interface</span> <span class="tp">Usuario</span> {
  id: <span class="tp">number</span>;
  nombre: <span class="tp">string</span>;
  email: <span class="tp">string</span>;
}

<span class="cm">// Class — define estructura + comportamiento</span>
<span class="kw">class</span> <span class="tp">UsuarioService</span> {
  <span class="kw">private</span> usuarios: <span class="tp">Usuario</span>[] = [];

  <span class="fn">crear</span>(datos: <span class="tp">Usuario</span>): <span class="tp">Usuario</span> {
    <span class="kw">this</span>.usuarios.<span class="fn">push</span>(datos);
    <span class="kw">return</span> datos;
  }

  <span class="fn">buscar</span>(id: <span class="tp">number</span>): <span class="tp">Usuario</span> | <span class="kw">undefined</span> {
    <span class="kw">return this</span>.usuarios.<span class="fn">find</span>(u => u.id === id);
  }
}

<span class="cm">// En NestJS, los servicios son exactamente esto:</span>
<span class="cm">// clases con métodos que manipulan datos.</span>`
        },
        quiz: {
          q: "En NestJS, ¿qué existe en el JavaScript compilado final: interfaces o clases?",
          options: ["Solo interfaces", "Solo clases", "Ambas", "Ninguna"],
          correct: 1,
          feedback: "Las interfaces de TypeScript son solo para el compilador. Al compilar a JS desaparecen. Las clases sí existen en el JS final, por eso NestJS las usa para todo."
        }
      },
      {
        heading: "Decoradores — El corazón de NestJS",
        body: `
<p>Un decorador es una función que <strong>modifica o anota</strong> una clase, método o propiedad. En TypeScript se escriben con <code>@</code> justo antes del elemento que anotan.</p>
<p>NestJS usa decoradores para todo. Cuando escribes <code>@Controller()</code> o <code>@Get()</code>, estás usando decoradores que le dicen al framework cómo debe tratar esa clase o método.</p>
<p>No necesitas saber crear decoradores desde cero al inicio — solo entender qué hacen los de NestJS.</p>
        `,
        code: {
          lang: "typescript",
          label: "Decoradores en acción — un controlador real de NestJS",
          content: `<span class="kw">import</span> { Controller, Get, Post, Body, Param } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Controller</span>(<span class="str">'usuarios'</span>)   <span class="cm">// → esta clase maneja rutas que empiezan en /usuarios</span>
<span class="kw">export class</span> <span class="tp">UsuariosController</span> {

  <span class="dec">@Get</span>()              <span class="cm">// → GET /usuarios</span>
  <span class="fn">listar</span>() {
    <span class="kw">return</span> [{ id: <span class="num">1</span>, nombre: <span class="str">'Ana'</span> }];
  }

  <span class="dec">@Get</span>(<span class="str">':id'</span>)          <span class="cm">// → GET /usuarios/42</span>
  <span class="fn">buscar</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>) {
    <span class="kw">return</span> { id, nombre: <span class="str">'Ana'</span> };
  }

  <span class="dec">@Post</span>()             <span class="cm">// → POST /usuarios</span>
  <span class="fn">crear</span>(<span class="dec">@Body</span>() datos: <span class="kw">any</span>) {
    <span class="kw">return</span> datos;
  }
}`
        },
        callout: { title: "Lo más importante", text: "Los decoradores son la sintaxis central de NestJS. Cada @algo que ves le está diciendo al framework qué debe hacer con esa clase o método. Todo lo que aprendas de NestJS lo verás a través de decoradores." },
        quiz: {
          q: "¿Qué hace @Controller('usuarios') en una clase?",
          options: ["Crea una instancia automática de la clase", "Le dice a NestJS que esa clase maneja rutas que empiezan con /usuarios", "Convierte la clase en un servicio inyectable", "Exporta la clase al módulo principal"],
          correct: 1,
          feedback: "Correcto. @Controller('usuarios') registra esa clase como controlador HTTP y le asigna el prefijo /usuarios a todas sus rutas."
        }
      },
      {
        heading: "Genéricos — Promise<T> y Observable<T>",
        body: `
<p>Un genérico es un tipo que acepta otro tipo como parámetro. Lo ves así: <code>Clase&lt;T&gt;</code>. La <code>T</code> es un placeholder que se reemplaza con el tipo real.</p>
<p>En NestJS los usarás principalmente en:</p>
<ul>
  <li><strong>Promise&lt;Usuario&gt;</strong> — una promesa que cuando se resuelve devuelve un Usuario.</li>
  <li><strong>Array&lt;string&gt;</strong> — equivalente a <code>string[]</code>.</li>
  <li><strong>Observable&lt;T&gt;</strong> — lo verás en microservicios con RxJS.</li>
</ul>
        `,
        code: {
          lang: "typescript",
          label: "Genéricos en servicios de NestJS",
          content: `<span class="kw">interface</span> <span class="tp">Usuario</span> {
  id: <span class="tp">number</span>;
  nombre: <span class="tp">string</span>;
}

<span class="cm">// Promise<Usuario> → esta función devuelve una promesa</span>
<span class="cm">// que, cuando se resuelve, tiene un objeto Usuario</span>
<span class="kw">async function</span> <span class="fn">buscar</span>(id: <span class="tp">number</span>): <span class="tp">Promise</span>&lt;<span class="tp">Usuario</span>&gt; {
  <span class="kw">return</span> { id, nombre: <span class="str">'Ana'</span> };
}

<span class="cm">// Promise<Usuario[]> → devuelve una lista de usuarios</span>
<span class="kw">async function</span> <span class="fn">listar</span>(): <span class="tp">Promise</span>&lt;<span class="tp">Usuario</span>[]&gt; {
  <span class="kw">return</span> [{ id: <span class="num">1</span>, nombre: <span class="str">'Ana'</span> }];
}

<span class="cm">// En un servicio real de NestJS verás exactamente esto:</span>
<span class="cm">// async findOne(id: number): Promise<User> { ... }</span>`
        },
        quiz: {
          q: "¿Qué tipo devuelve una función con return type Promise<string>?",
          options: ["Un string directamente", "Una promesa que cuando se resuelve da un string", "Un array de strings", "Un objeto con propiedad string"],
          correct: 1,
          feedback: "Exacto. Promise<string> significa: 'esta función es asíncrona y cuando termina entrega un string'. Para obtener el string usas await."
        }
      }
    ]
  },
  {
    title: "HTTP y REST",
    desc: "NestJS es principalmente un framework para construir APIs REST. Necesitas entender cómo funciona HTTP antes de construir endpoints.",
    lessons: [
      {
        heading: "Verbos HTTP",
        body: `
<p>HTTP define verbos (también llamados métodos) que indican qué tipo de operación quieres hacer. En REST cada verbo tiene un significado semántico:</p>
<ul>
  <li><strong>GET</strong> — Obtener datos. No modifica nada.</li>
  <li><strong>POST</strong> — Crear un recurso nuevo.</li>
  <li><strong>PUT</strong> — Reemplazar un recurso completo.</li>
  <li><strong>PATCH</strong> — Actualizar campos específicos de un recurso.</li>
  <li><strong>DELETE</strong> — Eliminar un recurso.</li>
</ul>
<p>NestJS tiene un decorador para cada verbo: <code>@Get()</code>, <code>@Post()</code>, <code>@Put()</code>, <code>@Patch()</code>, <code>@Delete()</code>.</p>
        `,
        code: {
          lang: "typescript",
          label: "CRUD completo — verbos HTTP en NestJS",
          content: `<span class="dec">@Controller</span>(<span class="str">'productos'</span>)
<span class="kw">export class</span> <span class="tp">ProductosController</span> {

  <span class="dec">@Get</span>()                    <span class="cm">// GET /productos</span>
  <span class="fn">listar</span>() {}

  <span class="dec">@Get</span>(<span class="str">':id'</span>)              <span class="cm">// GET /productos/5</span>
  <span class="fn">buscar</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>) {}

  <span class="dec">@Post</span>()                   <span class="cm">// POST /productos</span>
  <span class="fn">crear</span>(<span class="dec">@Body</span>() dto: <span class="kw">any</span>) {}

  <span class="dec">@Patch</span>(<span class="str">':id'</span>)            <span class="cm">// PATCH /productos/5</span>
  <span class="fn">actualizar</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>, <span class="dec">@Body</span>() dto: <span class="kw">any</span>) {}

  <span class="dec">@Delete</span>(<span class="str">':id'</span>)           <span class="cm">// DELETE /productos/5</span>
  <span class="fn">eliminar</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>) {}
}`
        },
        quiz: {
          q: "Tienes una API de tareas. ¿Qué verbo usas para marcar una tarea como completada sin reemplazarla entera?",
          options: ["GET", "POST", "PUT", "PATCH"],
          correct: 3,
          feedback: "PATCH es para actualizaciones parciales. PUT reemplaza el recurso completo. Para cambiar solo el campo 'completada', usas PATCH."
        }
      },
      {
        heading: "Status codes",
        body: `
<p>Cada respuesta HTTP incluye un código numérico que indica si la operación fue exitosa o qué salió mal. Los más importantes en APIs REST:</p>
<ul>
  <li><strong>200 OK</strong> — Éxito general (GET, PATCH, DELETE exitosos).</li>
  <li><strong>201 Created</strong> — Recurso creado (POST exitoso).</li>
  <li><strong>400 Bad Request</strong> — El cliente envió datos inválidos.</li>
  <li><strong>401 Unauthorized</strong> — No autenticado.</li>
  <li><strong>403 Forbidden</strong> — Autenticado pero sin permisos.</li>
  <li><strong>404 Not Found</strong> — El recurso no existe.</li>
  <li><strong>500 Internal Server Error</strong> — Error en el servidor.</li>
</ul>
<p>NestJS devuelve 200 por defecto para GET/PATCH/DELETE y 201 para POST. Puedes cambiarlo con el decorador <code>@HttpCode()</code>.</p>
        `,
        code: {
          lang: "typescript",
          label: "Controlar el status code en NestJS",
          content: `<span class="kw">import</span> { Controller, Post, HttpCode, HttpStatus } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Controller</span>(<span class="str">'auth'</span>)
<span class="kw">export class</span> <span class="tp">AuthController</span> {

  <span class="dec">@Post</span>(<span class="str">'login'</span>)
  <span class="dec">@HttpCode</span>(<span class="tp">HttpStatus</span>.OK)  <span class="cm">// 200 en vez del 201 por defecto de @Post</span>
  <span class="fn">login</span>(<span class="dec">@Body</span>() credentials: <span class="kw">any</span>) {
    <span class="kw">return</span> { token: <span class="str">'jwt...'</span> };
  }

  <span class="dec">@Post</span>(<span class="str">'register'</span>)
  <span class="cm">// Aquí sí queremos 201 — POST por defecto lo hace</span>
  <span class="fn">register</span>(<span class="dec">@Body</span>() dto: <span class="kw">any</span>) {
    <span class="kw">return</span> { id: <span class="num">1</span>, message: <span class="str">'Usuario creado'</span> };
  }
}`
        },
        quiz: {
          q: "Tu endpoint POST /usuarios funciona y crea el usuario. ¿Qué status code debería devolver por defecto?",
          options: ["200", "201", "204", "301"],
          correct: 1,
          feedback: "201 Created. NestJS lo hace automáticamente para @Post(). Indica que el recurso fue creado exitosamente."
        }
      }
    ]
  },
  {
    title: "Instalar NestJS y tu primer proyecto",
    desc: "Ahora sí. Instalas el CLI, creas el proyecto y entiendes cada archivo que genera NestJS automáticamente.",
    lessons: [
      {
        heading: "Instalar el CLI y crear el proyecto",
        body: `
<p>NestJS tiene un CLI (Command Line Interface) que automatiza la creación de archivos y proyectos. Necesitas Node.js instalado (versión 16 o superior).</p>
<p>Pasos:</p>
<ul>
  <li>Instala el CLI globalmente una sola vez.</li>
  <li>Crea el proyecto con <code>nest new nombre-del-proyecto</code>.</li>
  <li>El CLI te pregunta qué gestor de paquetes usar (npm, yarn, pnpm). Elige npm si no tienes preferencia.</li>
  <li>Entra al directorio y arranca el servidor.</li>
</ul>
        `,
        code: {
          lang: "bash",
          label: "Terminal — instalación y primer proyecto",
          content: `<span class="cm"># 1. Instalar CLI de NestJS globalmente</span>
npm install -g @nestjs/cli

<span class="cm"># 2. Crear proyecto</span>
nest new mi-api

<span class="cm"># 3. Entrar al directorio</span>
cd mi-api

<span class="cm"># 4. Arrancar en modo desarrollo (se reinicia solo al guardar cambios)</span>
npm run start:dev

<span class="cm"># Verás algo así:</span>
<span class="cm"># [Nest] LOG [NestApplication] Nest application successfully started</span>
<span class="cm"># La app corre en http://localhost:3000</span>`
        },
        callout: { title: "Prueba que funciona", text: "Abre http://localhost:3000 en tu navegador. Deberías ver 'Hello World!'. Eso viene del controlador que NestJS genera automáticamente." }
      },
      {
        heading: "Estructura del proyecto",
        body: `
<p>NestJS genera varios archivos. Los que importan al principio:</p>
<ul>
  <li><strong>src/main.ts</strong> — El punto de entrada. Crea la app y la pone a escuchar.</li>
  <li><strong>src/app.module.ts</strong> — El módulo raíz. Registra todos los demás módulos.</li>
  <li><strong>src/app.controller.ts</strong> — Controlador de ejemplo con una ruta GET /.</li>
  <li><strong>src/app.service.ts</strong> — Servicio de ejemplo con la lógica del controlador.</li>
</ul>
        `,
        code: {
          lang: "typescript",
          label: "src/main.ts — El arranque de la app",
          content: `<span class="kw">import</span> { NestFactory } <span class="kw">from</span> <span class="str">'@nestjs/core'</span>;
<span class="kw">import</span> { AppModule } <span class="kw">from</span> <span class="str">'./app.module'</span>;

<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="cm">// Crea la aplicación usando el módulo raíz</span>
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>(AppModule);

  <span class="cm">// La pone a escuchar en el puerto 3000</span>
  <span class="kw">await</span> app.<span class="fn">listen</span>(<span class="num">3000</span>);
}

<span class="fn">bootstrap</span>();`
        },
        code2: {
          lang: "typescript",
          label: "src/app.module.ts — El módulo raíz",
          content: `<span class="kw">import</span> { Module } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { AppController } <span class="kw">from</span> <span class="str">'./app.controller'</span>;
<span class="kw">import</span> { AppService } <span class="kw">from</span> <span class="str">'./app.service'</span>;

<span class="dec">@Module</span>({
  imports: [],                        <span class="cm">// otros módulos que necesita</span>
  controllers: [AppController],       <span class="cm">// controladores de este módulo</span>
  providers: [AppService],            <span class="cm">// servicios disponibles aquí</span>
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
        },
        quiz: {
          q: "¿Cuál es el archivo que NestJS ejecuta primero cuando arranca la aplicación?",
          options: ["app.module.ts", "app.controller.ts", "main.ts", "package.json"],
          correct: 2,
          feedback: "main.ts es el punto de entrada. Llama a bootstrap() que crea la app con NestFactory.create() y la pone a escuchar peticiones."
        }
      }
    ]
  },
  {
    title: "Módulos, Controladores y Servicios",
    desc: "Estos tres conceptos son la estructura central de NestJS. Casi todo lo que construyas en NestJS vive dentro de uno de estos tres.",
    lessons: [
      {
        heading: "El patrón MVC de NestJS",
        body: `
<p>NestJS separa la app en capas con responsabilidades claras:</p>
<ul>
  <li><strong>Módulo</strong>: agrupa funcionalidades relacionadas. Es el contenedor.</li>
  <li><strong>Controlador</strong>: recibe peticiones HTTP y devuelve respuestas. Solo eso.</li>
  <li><strong>Servicio (Provider)</strong>: contiene la lógica de negocio. El controlador lo llama.</li>
</ul>
<p>Esta separación es intencional. El controlador no debería saber cómo se buscan datos en la base de datos — eso le corresponde al servicio.</p>
        `,
        code: {
          lang: "typescript",
          label: "Crear un módulo completo con el CLI",
          content: `<span class="cm"># El CLI genera el módulo, controlador y servicio en un comando</span>
nest generate module usuarios
nest generate controller usuarios
nest generate service usuarios

<span class="cm"># O con el shorthand:</span>
nest g mo usuarios
nest g co usuarios
nest g s usuarios

<span class="cm"># Resultado en src/usuarios/:</span>
<span class="cm"># usuarios.module.ts</span>
<span class="cm"># usuarios.controller.ts</span>
<span class="cm"># usuarios.service.ts</span>
<span class="cm"># (+ archivos .spec.ts para tests)</span>`
        }
      },
      {
        heading: "Inyección de dependencias",
        body: `
<p>La inyección de dependencias (DI) es cómo NestJS conecta el servicio con el controlador. En vez de que el controlador cree una instancia del servicio manualmente, NestJS se encarga de crearlo y pasarlo automáticamente.</p>
<p>Para que funcione:</p>
<ul>
  <li>El servicio debe tener el decorador <code>@Injectable()</code>.</li>
  <li>El módulo debe registrar el servicio en <code>providers</code>.</li>
  <li>El controlador declara el servicio en su constructor.</li>
</ul>
        `,
        code: {
          lang: "typescript",
          label: "Servicio + Controlador + Módulo conectados",
          content: `<span class="cm">// usuarios.service.ts</span>
<span class="kw">import</span> { Injectable } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">UsuariosService</span> {
  <span class="kw">private</span> usuarios = [
    { id: <span class="num">1</span>, nombre: <span class="str">'Ana'</span> },
    { id: <span class="num">2</span>, nombre: <span class="str">'Luis'</span> },
  ];

  <span class="fn">findAll</span>() {
    <span class="kw">return this</span>.usuarios;
  }

  <span class="fn">findOne</span>(id: <span class="tp">number</span>) {
    <span class="kw">return this</span>.usuarios.<span class="fn">find</span>(u => u.id === id);
  }
}

<span class="cm">// usuarios.controller.ts</span>
<span class="kw">import</span> { Controller, Get, Param } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { UsuariosService } <span class="kw">from</span> <span class="str">'./usuarios.service'</span>;

<span class="dec">@Controller</span>(<span class="str">'usuarios'</span>)
<span class="kw">export class</span> <span class="tp">UsuariosController</span> {
  <span class="cm">// NestJS inyecta el servicio automáticamente aquí:</span>
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> usuariosService: <span class="tp">UsuariosService</span>) {}

  <span class="dec">@Get</span>()
  <span class="fn">findAll</span>() {
    <span class="kw">return this</span>.usuariosService.<span class="fn">findAll</span>();
  }

  <span class="dec">@Get</span>(<span class="str">':id'</span>)
  <span class="fn">findOne</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>) {
    <span class="kw">return this</span>.usuariosService.<span class="fn">findOne</span>(+id); <span class="cm">// +id convierte string a number</span>
  }
}

<span class="cm">// usuarios.module.ts</span>
<span class="kw">import</span> { Module } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { UsuariosController } <span class="kw">from</span> <span class="str">'./usuarios.controller'</span>;
<span class="kw">import</span> { UsuariosService } <span class="kw">from</span> <span class="str">'./usuarios.service'</span>;

<span class="dec">@Module</span>({
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
<span class="kw">export class</span> <span class="tp">UsuariosModule</span> {}`
        },
        callout: { title: "Regla de oro", text: "El controlador solo llama al servicio. El servicio es quien hace el trabajo. Si encuentras lógica de negocio en un controlador, hay que moverla al servicio." },
        quiz: {
          q: "¿Por qué un servicio necesita el decorador @Injectable()?",
          options: ["Para que TypeScript lo compile correctamente", "Para que NestJS sepa que puede gestionarlo e inyectarlo automáticamente", "Para que tenga acceso a HTTP", "Es opcional, solo una convención"],
          correct: 1,
          feedback: "@Injectable() marca la clase para que el sistema de DI de NestJS la gestione. Sin él, NestJS no puede inyectarla en el constructor del controlador."
        }
      }
    ]
  },
  {
    title: "DTOs y Validación",
    desc: "Los DTOs definen la forma exacta de los datos que entran a tu API. Con class-validator puedes validarlos automáticamente.",
    lessons: [
      {
        heading: "¿Qué es un DTO?",
        body: `
<p>DTO significa <strong>Data Transfer Object</strong>. Es una clase TypeScript que define exactamente qué campos esperas en el body de una petición.</p>
<p>Sin DTO, cualquier dato puede entrar a tu API. Con DTO, NestJS valida automáticamente la estructura antes de que llegue al controlador.</p>
<p>Primero instala las dependencias:</p>
        `,
        code: {
          lang: "bash",
          label: "Instalar dependencias de validación",
          content: `npm install class-validator class-transformer`
        },
        code2: {
          lang: "typescript",
          label: "DTO con validaciones",
          content: `<span class="cm">// create-usuario.dto.ts</span>
<span class="kw">import</span> { IsString, IsEmail, MinLength, IsInt, Min } <span class="kw">from</span> <span class="str">'class-validator'</span>;

<span class="kw">export class</span> <span class="tp">CreateUsuarioDto</span> {
  <span class="dec">@IsString</span>()
  <span class="dec">@MinLength</span>(<span class="num">2</span>)
  nombre: <span class="tp">string</span>;

  <span class="dec">@IsEmail</span>()
  email: <span class="tp">string</span>;

  <span class="dec">@IsInt</span>()
  <span class="dec">@Min</span>(<span class="num">18</span>)
  edad: <span class="tp">number</span>;
}

<span class="cm">// usuarios.controller.ts</span>
<span class="dec">@Post</span>()
<span class="fn">crear</span>(<span class="dec">@Body</span>() dto: <span class="tp">CreateUsuarioDto</span>) {
  <span class="cm">// Si llega aquí, los datos ya están validados</span>
  <span class="kw">return</span> <span class="kw">this</span>.usuariosService.<span class="fn">crear</span>(dto);
}`
        }
      },
      {
        heading: "ValidationPipe global",
        body: `
<p>Para que la validación funcione, necesitas activar el <code>ValidationPipe</code> en main.ts. Sin esto, los decoradores de class-validator existen pero no hacen nada.</p>
<p>Al activarlo globalmente, aplica a todos los endpoints de tu app automáticamente.</p>
        `,
        code: {
          lang: "typescript",
          label: "main.ts — Activar validación global",
          content: `<span class="kw">import</span> { NestFactory } <span class="kw">from</span> <span class="str">'@nestjs/core'</span>;
<span class="kw">import</span> { ValidationPipe } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { AppModule } <span class="kw">from</span> <span class="str">'./app.module'</span>;

<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>(AppModule);

  <span class="cm">// Activa validación en toda la app</span>
  app.<span class="fn">useGlobalPipes</span>(<span class="kw">new</span> <span class="fn">ValidationPipe</span>({
    whitelist: <span class="kw">true</span>,      <span class="cm">// elimina campos no declarados en el DTO</span>
    forbidNonWhitelisted: <span class="kw">true</span>, <span class="cm">// devuelve error si llegan campos extra</span>
    transform: <span class="kw">true</span>,      <span class="cm">// convierte tipos automáticamente (ej: string → number)</span>
  }));

  <span class="kw">await</span> app.<span class="fn">listen</span>(<span class="num">3000</span>);
}

<span class="fn">bootstrap</span>();

<span class="cm">// Si envías { nombre: "A", email: "noesvalido", edad: 15 }</span>
<span class="cm">// NestJS responde 400 Bad Request automáticamente con los errores</span>`
        },
        callout: { title: "whitelist: true — importante", text: "Con whitelist activo, si el cliente envía campos que no están en el DTO (como 'isAdmin: true' para intentar escalar privilegios), NestJS los elimina silenciosamente antes de que lleguen al servicio." },
        quiz: {
          q: "¿Dónde activas el ValidationPipe para que aplique a toda la app?",
          options: ["En cada controlador con @UseFilters()", "En app.module.ts en providers", "En main.ts con app.useGlobalPipes()", "En cada DTO manualmente"],
          correct: 2,
          feedback: "Correcto. app.useGlobalPipes(new ValidationPipe()) en main.ts lo aplica a todos los endpoints. Es la forma recomendada."
        }
      }
    ]
  },
  {
    title: "Base de datos con TypeORM",
    desc: "TypeORM es la opción más usada con NestJS para SQL. Conectas la base de datos, defines entidades y usas el patrón Repository para acceder a los datos.",
    lessons: [
      {
        heading: "Configurar la conexión",
        body: `
<p>NestJS tiene un módulo oficial para TypeORM. Necesitas instalarlo junto a TypeORM y el driver de tu base de datos.</p>
        `,
        code: {
          lang: "bash",
          label: "Instalar TypeORM + PostgreSQL",
          content: `npm install @nestjs/typeorm typeorm pg

<span class="cm"># Si usas MySQL en vez de PostgreSQL:</span>
npm install @nestjs/typeorm typeorm mysql2`
        },
        code2: {
          lang: "typescript",
          label: "app.module.ts — Conectar la base de datos",
          content: `<span class="kw">import</span> { TypeOrmModule } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;

<span class="dec">@Module</span>({
  imports: [
    <span class="fn">TypeOrmModule</span>.<span class="fn">forRoot</span>({
      type: <span class="str">'postgres'</span>,
      host: <span class="str">'localhost'</span>,
      port: <span class="num">5432</span>,
      username: <span class="str">'postgres'</span>,
      password: <span class="str">'password'</span>,
      database: <span class="str">'mi_db'</span>,
      entities: [<span class="fn">__dirname</span> + <span class="str">'/**/*.entity{.ts,.js}'</span>],
      synchronize: <span class="kw">true</span>, <span class="cm">// ⚠️ solo en desarrollo, nunca en producción</span>
    }),
  ],
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
        }
      },
      {
        heading: "Entidades y Repository",
        body: `
<p>Una <strong>Entity</strong> es una clase TypeScript que mapea a una tabla en la base de datos. Cada propiedad decorada es una columna.</p>
<p>El <strong>Repository</strong> es el objeto que usas para hacer queries: buscar, crear, actualizar, eliminar. NestJS te lo inyecta automáticamente con <code>@InjectRepository()</code>.</p>
        `,
        code: {
          lang: "typescript",
          label: "Entity + Service con Repository",
          content: `<span class="cm">// usuario.entity.ts</span>
<span class="kw">import</span> { Entity, PrimaryGeneratedColumn, Column } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Entity</span>()
<span class="kw">export class</span> <span class="tp">Usuario</span> {
  <span class="dec">@PrimaryGeneratedColumn</span>()
  id: <span class="tp">number</span>;

  <span class="dec">@Column</span>()
  nombre: <span class="tp">string</span>;

  <span class="dec">@Column</span>({ unique: <span class="kw">true</span> })
  email: <span class="tp">string</span>;

  <span class="dec">@Column</span>({ default: <span class="kw">true</span> })
  activo: <span class="tp">boolean</span>;
}

<span class="cm">// usuarios.service.ts</span>
<span class="kw">import</span> { InjectRepository } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;
<span class="kw">import</span> { Repository } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">UsuariosService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@InjectRepository</span>(<span class="tp">Usuario</span>)
    <span class="kw">private</span> repo: <span class="tp">Repository</span>&lt;<span class="tp">Usuario</span>&gt;
  ) {}

  <span class="fn">findAll</span>(): <span class="tp">Promise</span>&lt;<span class="tp">Usuario</span>[]&gt; {
    <span class="kw">return this</span>.repo.<span class="fn">find</span>();
  }

  <span class="fn">findOne</span>(id: <span class="tp">number</span>): <span class="tp">Promise</span>&lt;<span class="tp">Usuario</span>&gt; {
    <span class="kw">return this</span>.repo.<span class="fn">findOneBy</span>({ id });
  }

  <span class="kw">async</span> <span class="fn">crear</span>(dto: <span class="tp">CreateUsuarioDto</span>): <span class="tp">Promise</span>&lt;<span class="tp">Usuario</span>&gt; {
    <span class="kw">const</span> usuario = <span class="kw">this</span>.repo.<span class="fn">create</span>(dto);
    <span class="kw">return this</span>.repo.<span class="fn">save</span>(usuario);
  }

  <span class="kw">async</span> <span class="fn">eliminar</span>(id: <span class="tp">number</span>) {
    <span class="kw">return this</span>.repo.<span class="fn">delete</span>(id);
  }
}`
        },
        quiz: {
          q: "¿Qué hace repo.create(dto) en TypeORM?",
          options: ["Guarda el registro en la base de datos", "Crea una instancia de la entidad en memoria sin guardarla", "Actualiza un registro existente", "Valida los datos del DTO"],
          correct: 1,
          feedback: "create() solo crea la instancia en memoria. Para persistirla en la BD necesitas llamar a save() después. Es un patrón común: create() + save()."
        }
      }
    ]
  },
  {
    title: "Autenticación con JWT",
    desc: "La autenticación JWT es el estándar para APIs REST modernas. NestJS usa Passport.js con una estrategia JWT para proteger rutas.",
    lessons: [
      {
        heading: "¿Cómo funciona JWT?",
        body: `
<p>JWT (JSON Web Token) es un token firmado que el servidor emite al hacer login. El cliente lo guarda y lo envía en cada petición posterior en el header <code>Authorization: Bearer &lt;token&gt;</code>.</p>
<p>El token tiene 3 partes separadas por puntos:</p>
<ul>
  <li><strong>Header</strong>: algoritmo de firma.</li>
  <li><strong>Payload</strong>: datos del usuario (id, email, rol). NO pongas datos sensibles aquí.</li>
  <li><strong>Signature</strong>: garantiza que el token no fue alterado.</li>
</ul>
<p>El servidor no necesita guardar el token en ningún lado — solo verifica la firma con el secret.</p>
        `,
        code: {
          lang: "bash",
          label: "Instalar dependencias",
          content: `npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt`
        },
        code2: {
          lang: "typescript",
          label: "AuthService — login y generación del token",
          content: `<span class="kw">import</span> { JwtService } <span class="kw">from</span> <span class="str">'@nestjs/jwt'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">AuthService</span> {
  <span class="kw">constructor</span>(
    <span class="kw">private</span> usuariosService: <span class="tp">UsuariosService</span>,
    <span class="kw">private</span> jwtService: <span class="tp">JwtService</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">login</span>(email: <span class="tp">string</span>, password: <span class="tp">string</span>) {
    <span class="kw">const</span> user = <span class="kw">await this</span>.usuariosService.<span class="fn">findByEmail</span>(email);

    <span class="kw">if</span> (!user || !<span class="fn">bcrypt.compareSync</span>(password, user.password)) {
      <span class="kw">throw new</span> <span class="fn">UnauthorizedException</span>(<span class="str">'Credenciales inválidas'</span>);
    }

    <span class="cm">// Payload que se guarda en el token (visible, no poner contraseñas)</span>
    <span class="kw">const</span> payload = { sub: user.id, email: user.email };

    <span class="kw">return</span> {
      access_token: <span class="kw">await this</span>.jwtService.<span class="fn">signAsync</span>(payload),
    };
  }
}`
        }
      },
      {
        heading: "Guards — Proteger rutas",
        body: `
<p>Un Guard decide si una petición puede continuar o no. <code>JwtAuthGuard</code> verifica que el token JWT sea válido antes de dejar pasar la petición al controlador.</p>
<p>Puedes aplicar el guard a rutas individuales con <code>@UseGuards()</code> o globalmente en toda la app.</p>
        `,
        code: {
          lang: "typescript",
          label: "Proteger rutas con @UseGuards",
          content: `<span class="kw">import</span> { UseGuards, Request } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { JwtAuthGuard } <span class="kw">from</span> <span class="str">'./jwt-auth.guard'</span>;

<span class="dec">@Controller</span>(<span class="str">'perfil'</span>)
<span class="kw">export class</span> <span class="tp">PerfilController</span> {

  <span class="dec">@Get</span>()
  <span class="dec">@UseGuards</span>(<span class="tp">JwtAuthGuard</span>)      <span class="cm">// 🔒 solo usuarios autenticados</span>
  <span class="fn">getPerfil</span>(<span class="dec">@Request</span>() req) {
    <span class="cm">// req.user contiene el payload del JWT</span>
    <span class="kw">return</span> req.user;
  }

  <span class="dec">@Get</span>(<span class="str">'publico'</span>)               <span class="cm">// sin guard = ruta pública</span>
  <span class="fn">infoPublica</span>() {
    <span class="kw">return</span> { mensaje: <span class="str">'esto lo ve cualquiera'</span> };
  }
}

<span class="cm">// Si el token es inválido o no se envía, NestJS responde:</span>
<span class="cm">// 401 Unauthorized</span>`
        },
        quiz: {
          q: "¿Qué pasa si un cliente hace GET /perfil sin enviar el token JWT?",
          options: ["NestJS devuelve 200 con datos vacíos", "NestJS devuelve 401 Unauthorized", "NestJS devuelve 403 Forbidden", "La petición llega al controlador sin el payload"],
          correct: 1,
          feedback: "El JwtAuthGuard verifica el token antes de que la petición llegue al controlador. Sin token válido, devuelve 401 Unauthorized automáticamente."
        }
      }
    ]
  },
  {
    title: "Variables de entorno y Configuración",
    desc: "Las credenciales de BD, secrets JWT y URLs de servicios externos no van en el código. Van en variables de entorno.",
    lessons: [
      {
        heading: "ConfigModule — La forma correcta",
        body: `
<p>NestJS tiene <code>@nestjs/config</code> para gestionar variables de entorno. Lee el archivo <code>.env</code> y las expone a través de <code>ConfigService</code>.</p>
<p><strong>Regla básica</strong>: nunca hardcodees credenciales en el código. Si el repositorio es público, cualquiera puede ver tu base de datos.</p>
        `,
        code: {
          lang: "bash",
          label: "Instalar y configurar",
          content: `npm install @nestjs/config`
        },
        code2: {
          lang: "bash",
          label: ".env — en la raíz del proyecto (nunca lo commitees)",
          content: `<span class="cm"># .env</span>
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=mipassword
DB_NAME=mi_db
JWT_SECRET=un_secret_muy_largo_y_aleatorio
PORT=3000`
        },
        code3: {
          lang: "typescript",
          label: "Usar ConfigService en cualquier servicio",
          content: `<span class="kw">import</span> { ConfigModule, ConfigService } <span class="kw">from</span> <span class="str">'@nestjs/config'</span>;

<span class="cm">// app.module.ts — cargar ConfigModule globalmente</span>
<span class="dec">@Module</span>({
  imports: [
    <span class="fn">ConfigModule</span>.<span class="fn">forRoot</span>({ isGlobal: <span class="kw">true</span> }),
    <span class="fn">TypeOrmModule</span>.<span class="fn">forRootAsync</span>({
      <span class="fn">useFactory</span>(config: <span class="tp">ConfigService</span>) {
        <span class="kw">return</span> {
          type: <span class="str">'postgres'</span>,
          host: config.<span class="fn">get</span>(<span class="str">'DB_HOST'</span>),
          port: config.<span class="fn">get</span>&lt;<span class="tp">number</span>&gt;(<span class="str">'DB_PORT'</span>),
          username: config.<span class="fn">get</span>(<span class="str">'DB_USER'</span>),
          password: config.<span class="fn">get</span>(<span class="str">'DB_PASS'</span>),
          database: config.<span class="fn">get</span>(<span class="str">'DB_NAME'</span>),
          entities: [<span class="fn">__dirname</span> + <span class="str">'/**/*.entity{.ts,.js}'</span>],
        };
      },
      inject: [<span class="tp">ConfigService</span>],
    }),
  ],
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
        },
        callout: { title: "Agregar .env al .gitignore", text: "Agrega '.env' a tu .gitignore antes de hacer cualquier commit. Si ya lo subiste, el secret está comprometido y debes rotarlo." },
        quiz: {
          q: "¿Por qué no debes hardcodear las credenciales de la base de datos directamente en app.module.ts?",
          options: ["Porque NestJS no las lee correctamente ahí", "Porque cualquiera con acceso al repositorio puede verlas", "Porque TypeORM no acepta strings directos", "Es solo una convención sin impacto real"],
          correct: 1,
          feedback: "Correcto. Si el repo es público (o alguien clona el código), tiene acceso directo a tu base de datos. Las credenciales van en .env que se excluye del control de versiones."
        }
      }
    ]
  },
  {
    title: "Exception Filters y manejo de errores",
    desc: "NestJS tiene un sistema de excepciones que transforma errores en respuestas HTTP con el formato correcto.",
    lessons: [
      {
        heading: "Excepciones HTTP incorporadas",
        body: `
<p>NestJS incluye clases de excepción para los errores HTTP más comunes. Cuando lanzas una de estas en un servicio o controlador, NestJS la atrapa automáticamente y devuelve la respuesta correcta.</p>
        `,
        code: {
          lang: "typescript",
          label: "Excepciones HTTP en servicios",
          content: `<span class="kw">import</span> {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">UsuariosService</span> {

  <span class="kw">async</span> <span class="fn">findOne</span>(id: <span class="tp">number</span>): <span class="tp">Promise</span>&lt;<span class="tp">Usuario</span>&gt; {
    <span class="kw">const</span> usuario = <span class="kw">await this</span>.repo.<span class="fn">findOneBy</span>({ id });

    <span class="kw">if</span> (!usuario) {
      <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Usuario #\${id} no encontrado\`</span>);
      <span class="cm">// → 404 { "statusCode": 404, "message": "Usuario #5 no encontrado" }</span>
    }

    <span class="kw">return</span> usuario;
  }

  <span class="kw">async</span> <span class="fn">crear</span>(dto: <span class="tp">CreateUsuarioDto</span>) {
    <span class="kw">const</span> existe = <span class="kw">await this</span>.repo.<span class="fn">findOneBy</span>({ email: dto.email });

    <span class="kw">if</span> (existe) {
      <span class="kw">throw new</span> <span class="fn">ConflictException</span>(<span class="str">'El email ya está registrado'</span>);
      <span class="cm">// → 409 Conflict</span>
    }

    <span class="kw">return this</span>.repo.<span class="fn">save</span>(<span class="kw">this</span>.repo.<span class="fn">create</span>(dto));
  }
}`
        },
        callout: { title: "El filtro global de NestJS", text: "NestJS tiene un ExceptionFilter global que atrapa todas las HttpException y las convierte en la respuesta JSON correcta. No necesitas hacer nada extra para que funcione — ya está activo." },
        quiz: {
          q: "Buscas un usuario por ID y no existe. ¿Qué excepción lanzas?",
          options: ["BadRequestException", "UnauthorizedException", "NotFoundException", "ForbiddenException"],
          correct: 2,
          feedback: "NotFoundException devuelve 404 Not Found. Es el código semánticamente correcto cuando el recurso que se busca no existe."
        }
      }
    ]
  },
  {
    title: "Testing en NestJS",
    desc: "NestJS incluye Jest configurado desde el inicio. Puedes probar servicios y controladores en aislamiento sin levantar la app completa.",
    lessons: [
      {
        heading: "Unit tests de servicios",
        body: `
<p>Un unit test prueba una sola pieza en aislamiento. Para probar un servicio que usa un repositorio de TypeORM, reemplazas el repositorio real con un <strong>mock</strong> que devuelve datos controlados.</p>
<p>NestJS provee <code>Test.createTestingModule()</code> para montar el módulo de pruebas.</p>
        `,
        code: {
          lang: "typescript",
          label: "usuarios.service.spec.ts — Test unitario",
          content: `<span class="kw">import</span> { Test } <span class="kw">from</span> <span class="str">'@nestjs/testing'</span>;
<span class="kw">import</span> { getRepositoryToken } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;
<span class="kw">import</span> { UsuariosService } <span class="kw">from</span> <span class="str">'./usuarios.service'</span>;
<span class="kw">import</span> { Usuario } <span class="kw">from</span> <span class="str">'./usuario.entity'</span>;

<span class="fn">describe</span>(<span class="str">'UsuariosService'</span>, () => {
  <span class="kw">let</span> service: <span class="tp">UsuariosService</span>;

  <span class="cm">// Mock del repositorio — simula la BD sin conectarse</span>
  <span class="kw">const</span> mockRepo = {
    <span class="fn">find</span>: jest.<span class="fn">fn</span>(),
    <span class="fn">findOneBy</span>: jest.<span class="fn">fn</span>(),
    <span class="fn">create</span>: jest.<span class="fn">fn</span>(),
    <span class="fn">save</span>: jest.<span class="fn">fn</span>(),
  };

  <span class="fn">beforeEach</span>(<span class="kw">async</span> () => {
    <span class="kw">const</span> module = <span class="kw">await</span> Test.<span class="fn">createTestingModule</span>({
      providers: [
        UsuariosService,
        { provide: <span class="fn">getRepositoryToken</span>(Usuario), useValue: mockRepo },
      ],
    }).<span class="fn">compile</span>();

    service = module.<span class="fn">get</span>&lt;<span class="tp">UsuariosService</span>&gt;(UsuariosService);
  });

  <span class="fn">it</span>(<span class="str">'findAll devuelve lista de usuarios'</span>, <span class="kw">async</span> () => {
    <span class="kw">const</span> usuarios = [{ id: <span class="num">1</span>, nombre: <span class="str">'Ana'</span> }];
    mockRepo.find.<span class="fn">mockResolvedValue</span>(usuarios);

    <span class="kw">const</span> result = <span class="kw">await</span> service.<span class="fn">findAll</span>();
    <span class="fn">expect</span>(result).<span class="fn">toEqual</span>(usuarios);
  });

  <span class="fn">it</span>(<span class="str">'findOne lanza NotFoundException si no existe'</span>, <span class="kw">async</span> () => {
    mockRepo.findOneBy.<span class="fn">mockResolvedValue</span>(<span class="kw">null</span>);
    <span class="kw">await</span> <span class="fn">expect</span>(service.<span class="fn">findOne</span>(<span class="num">99</span>)).<span class="fn">rejects</span>.<span class="fn">toThrow</span>(<span class="str">'no encontrado'</span>);
  });
});`
        },
        code2: {
          lang: "bash",
          label: "Correr los tests",
          content: `<span class="cm"># Correr todos los tests</span>
npm run test

<span class="cm"># Watch mode (re-corre al guardar)</span>
npm run test:watch

<span class="cm"># Con coverage</span>
npm run test:cov`
        },
        quiz: {
          q: "¿Por qué usas un mock del repositorio en los unit tests en vez del repositorio real?",
          options: ["Porque TypeORM no funciona en tests", "Para no depender de una base de datos real y hacer el test rápido y predecible", "Porque Jest no soporta async/await con repos reales", "Es solo una convención sin beneficio real"],
          correct: 1,
          feedback: "Los unit tests deben ser rápidos y aislados. Si dependes de una BD real, el test puede fallar por problemas de red, datos incorrectos o la BD apagada — no por un bug en tu código."
        }
      }
    ]
  },
  {
    title: "Documentación con Swagger",
    desc: "Swagger genera documentación interactiva de tu API automáticamente a partir de tus controladores y DTOs.",
    lessons: [
      {
        heading: "Configurar Swagger",
        body: `
<p>Con <code>@nestjs/swagger</code> tienes una interfaz visual en <code>/api</code> donde puedes ver y probar todos tus endpoints sin necesidad de Postman.</p>
        `,
        code: {
          lang: "bash",
          label: "Instalar",
          content: `npm install @nestjs/swagger`
        },
        code2: {
          lang: "typescript",
          label: "main.ts — Activar Swagger",
          content: `<span class="kw">import</span> { SwaggerModule, DocumentBuilder } <span class="kw">from</span> <span class="str">'@nestjs/swagger'</span>;

<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>(AppModule);

  <span class="cm">// Configuración del documento Swagger</span>
  <span class="kw">const</span> config = <span class="kw">new</span> <span class="fn">DocumentBuilder</span>()
    .<span class="fn">setTitle</span>(<span class="str">'Mi API'</span>)
    .<span class="fn">setDescription</span>(<span class="str">'Documentación de la API REST'</span>)
    .<span class="fn">setVersion</span>(<span class="str">'1.0'</span>)
    .<span class="fn">addBearerAuth</span>()   <span class="cm">// para endpoints con JWT</span>
    .<span class="fn">build</span>();

  <span class="kw">const</span> document = SwaggerModule.<span class="fn">createDocument</span>(app, config);
  SwaggerModule.<span class="fn">setup</span>(<span class="str">'api'</span>, app, document);
  <span class="cm">// → disponible en http://localhost:3000/api</span>

  <span class="kw">await</span> app.<span class="fn">listen</span>(<span class="num">3000</span>);
}

<span class="cm">// Decorar DTOs para que Swagger los muestre:</span>
<span class="kw">import</span> { ApiProperty } <span class="kw">from</span> <span class="str">'@nestjs/swagger'</span>;

<span class="kw">export class</span> <span class="tp">CreateUsuarioDto</span> {
  <span class="dec">@ApiProperty</span>({ example: <span class="str">'Ana García'</span> })
  nombre: <span class="tp">string</span>;

  <span class="dec">@ApiProperty</span>({ example: <span class="str">'ana@email.com'</span> })
  email: <span class="tp">string</span>;
}`
        },
        callout: { title: "En producción", text: "Deshabilita Swagger en producción o protégelo con autenticación. Exponer la documentación pública facilita que atacantes mapeen tu API." }
      }
    ]
  },
  {
    title: "Deploy — Llevar tu app a producción",
    desc: "Compilas TypeScript a JavaScript, empaquetas con Docker y despiegas en el servicio que prefieras.",
    lessons: [
      {
        heading: "Build y Docker",
        body: `
<p>NestJS compila TypeScript a JavaScript con <code>nest build</code>. El resultado queda en la carpeta <code>dist/</code>. En producción corres el JS compilado, no el TS original.</p>
        `,
        code: {
          lang: "bash",
          label: "Compilar para producción",
          content: `<span class="cm"># Compilar TypeScript → JavaScript</span>
npm run build

<span class="cm"># Resultado en dist/</span>
<span class="cm"># Correr en producción:</span>
node dist/main.js`
        },
        code2: {
          lang: "dockerfile",
          label: "Dockerfile — multi-stage build",
          content: `<span class="cm"># Etapa 1: build</span>
FROM node:20-alpine <span class="kw">AS</span> builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

<span class="cm"># Etapa 2: producción (imagen más pequeña)</span>
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [<span class="str">"node"</span>, <span class="str">"dist/main.js"</span>]`
        },
        code3: {
          lang: "bash",
          label: "Correr con Docker",
          content: `<span class="cm"># Construir imagen</span>
docker build -t mi-api .

<span class="cm"># Correr contenedor</span>
docker run -p 3000:3000 --env-file .env mi-api

<span class="cm"># Con docker-compose (recomendado para incluir la BD):</span>
docker-compose up -d`
        },
        quiz: {
          q: "¿Por qué usas multi-stage build en el Dockerfile?",
          options: ["Para correr TypeScript directamente en producción", "Para que la imagen final sea más pequeña — solo incluye el JS compilado y deps de producción", "Es un requisito de NestJS para funcionar en Docker", "Para poder usar Swagger en producción"],
          correct: 1,
          feedback: "Multi-stage build separa la etapa de compilación de la etapa de ejecución. La imagen final solo contiene el JS compilado y las dependencias de producción, sin el código fuente TS ni las devDependencies."
        }
      }
    ]
  }
];

const STORAGE_KEY = 'nestjs-learn-v2';
let state = {};
try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch {}

let currentSection = 0;
let currentLesson = 0;

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function getSectionKey(si) { return `s${si}`; }

function totalSections() { return SECTIONS.length; }
function completedSections() { return SECTIONS.filter((_, i) => state[getSectionKey(i)]?.done).length; }

function buildNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = '';
  SECTIONS.forEach((s, i) => {
    const done = state[getSectionKey(i)]?.done;
    const active = i === currentSection;
    const el = document.createElement('div');
    el.className = 'nav-item' + (active ? ' active' : '') + (done ? ' completed' : '');
    el.innerHTML = `<span class="nav-num">${String(i+1).padStart(2,'0')}</span><div class="nav-dot"></div><span>${s.title}</span>`;
    el.onclick = () => { currentSection = i; currentLesson = 0; render(); };
    nav.appendChild(el);
  });
  const done = completedSections();
  const total = totalSections();
  document.getElementById('prog-label').textContent = `${done} / ${total}`;
  document.getElementById('prog-fill').style.width = Math.round((done/total)*100) + '%';
}

function codeBlock(obj, id) {
  if (!obj) return '';
  return `
    <div class="code-block">
      <div class="code-header">
        <span class="code-lang">${obj.lang} — ${obj.label || ''}</span>
        <button class="copy-btn" onclick="copyCode('code-${id}')">copiar</button>
      </div>
      <pre id="code-${id}">${obj.content}</pre>
    </div>`;
}

function copyCode(id) {
  const el = document.getElementById(id);
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = el.previousElementSibling.querySelector('.copy-btn');
    btn.textContent = '✓ copiado';
    setTimeout(() => btn.textContent = 'copiar', 1500);
  });
}

function render() {
  buildNav();
  const s = SECTIONS[currentSection];
  const l = s.lessons[currentLesson];
  const isLastLesson = currentLesson === s.lessons.length - 1;
  const isDone = state[getSectionKey(currentSection)]?.done;

  let quizHtml = '';
  if (l.quiz) {
    const q = l.quiz;
    const answered = state[`q-${currentSection}-${currentLesson}`];
    quizHtml = `
      <div class="quiz-block">
        <div class="quiz-title">✎ Comprueba tu entendimiento</div>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => {
            let cls = '';
            if (answered !== undefined) {
              if (oi === q.correct) cls = 'correct';
              else if (oi === answered && oi !== q.correct) cls = 'wrong';
            }
            return `<div class="quiz-option ${cls}" onclick="answerQuiz(${oi})">${opt}</div>`;
          }).join('')}
        </div>
        <div class="quiz-feedback ${answered !== undefined ? 'show ' + (answered === q.correct ? 'ok' : 'fail') : ''}">
          ${answered !== undefined ? (answered === q.correct ? '✓ ' + q.feedback : '✗ Incorrecto. ' + q.feedback) : ''}
        </div>
      </div>`;
  }

  const completeBtn = isLastLesson ? `
    <button class="complete-btn ${isDone ? 'done-state' : ''}" onclick="markDone()">
      ${isDone ? '✓ Sección completada' : 'Marcar sección como completada'}
    </button>` : '';

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="lesson-header">
      <div class="lesson-tag">Sección ${currentSection + 1} de ${SECTIONS.length} · Lección ${currentLesson + 1} de ${s.lessons.length}</div>
      <h1 class="lesson-title">${s.title}</h1>
      <p class="lesson-desc">${s.desc}</p>
    </div>
    <div class="divider"></div>
    <div class="lesson-body">
      <h2>${l.heading}</h2>
      ${l.body || ''}
      ${l.code ? codeBlock(l.code, `${currentSection}-${currentLesson}-a`) : ''}
      ${l.code2 ? codeBlock(l.code2, `${currentSection}-${currentLesson}-b`) : ''}
      ${l.code3 ? codeBlock(l.code3, `${currentSection}-${currentLesson}-c`) : ''}
      ${l.callout ? `<div class="callout"><div class="callout-title">${l.callout.title}</div><p>${l.callout.text}</p></div>` : ''}
      ${quizHtml}
    </div>
    <div class="bottom-nav">
      <button class="btn btn-ghost" onclick="prevLesson()" ${currentSection === 0 && currentLesson === 0 ? 'disabled' : ''}>← Anterior</button>
      ${completeBtn}
      <button class="btn btn-primary" onclick="nextLesson()" ${currentSection === SECTIONS.length - 1 && isLastLesson ? 'disabled' : ''}>Siguiente →</button>
    </div>
  `;
  content.scrollTop = 0;
}

function answerQuiz(idx) {
  const key = `q-${currentSection}-${currentLesson}`;
  if (state[key] !== undefined) return;
  state[key] = idx;
  save();
  render();
}

function markDone() {
  state[getSectionKey(currentSection)] = { done: true };
  save();
  render();
}

function nextLesson() {
  const s = SECTIONS[currentSection];
  if (currentLesson < s.lessons.length - 1) {
    currentLesson++;
  } else if (currentSection < SECTIONS.length - 1) {
    currentSection++;
    currentLesson = 0;
  }
  render();
}

function prevLesson() {
  if (currentLesson > 0) {
    currentLesson--;
  } else if (currentSection > 0) {
    currentSection--;
    currentLesson = SECTIONS[currentSection].lessons.length - 1;
  }
  render();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

render();
