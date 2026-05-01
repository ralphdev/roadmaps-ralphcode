export default {
  title: "Variables de entorno, Deployment y Docker",
  desc: "Gestiona configuración segura con @nestjs/config, valida el schema con Joi, despliega en la nube y dockeriza la aplicación con multi-stage build.",
  lectures: [
    {
      heading: "Configuración con @nestjs/config",
      body: `
<p>Las credenciales de BD, secrets JWT y URLs de servicios externos no van en el código fuente — van en variables de entorno. <code>@nestjs/config</code> carga el archivo <code>.env</code> y expone los valores vía <code>ConfigService</code>.</p>
<p><strong>Regla</strong>: nada con valor de credencial hardcodeado en el código. Si el repo se hace público, cualquiera tiene acceso a tu BD.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar y configurar",
        content: `npm install @nestjs/config`
      },
      code2: {
        lang: "bash",
        label: ".env — en la raíz (agregar a .gitignore)",
        content: `<span class="cm"># .env</span>
MONGODB_URI=mongodb://localhost:27017/nest-pokemon
PORT=3000`
      },
      code3: {
        lang: "typescript",
        label: "app.module.ts — ConfigModule global + conexión dinámica",
        content: `<span class="kw">import</span> { ConfigModule, ConfigService } <span class="kw">from</span> <span class="str">'@nestjs/config'</span>;

<span class="dec">@Module</span>({
  imports: [
    <span class="fn">ConfigModule</span>.<span class="fn">forRoot</span>({ isGlobal: <span class="kw">true</span> }),

    <span class="fn">MongooseModule</span>.<span class="fn">forRootAsync</span>({
      <span class="fn">useFactory</span>(config: <span class="tp">ConfigService</span>) {
        <span class="kw">return</span> {
          uri: config.<span class="fn">get</span>&lt;<span class="tp">string</span>&gt;(<span class="str">'MONGODB_URI'</span>),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
      },
      callout: { title: ".env en .gitignore", text: "Antes del primer commit, asegúrate de que .env esté en .gitignore. Si ya lo subiste, el secret está comprometido — debes rotarlo (cambiar contraseña/secret) inmediatamente." }
    },
    {
      heading: "Validación de variables con Joi",
      body: `
<p>Si una variable de entorno requerida no está definida, la app arranca de todas formas y falla después con errores crípticos. <strong>Joi</strong> valida el schema de variables de entorno al inicio — si algo falta, la app no arranca con un mensaje claro.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar Joi",
        content: `npm install joi`
      },
      code2: {
        lang: "typescript",
        label: "app.module.ts — validar variables con Joi",
        content: `<span class="kw">import</span> * <span class="kw">as</span> Joi <span class="kw">from</span> <span class="str">'joi'</span>;

<span class="fn">ConfigModule</span>.<span class="fn">forRoot</span>({
  isGlobal: <span class="kw">true</span>,
  validationSchema: Joi.<span class="fn">object</span>({
    MONGODB_URI: Joi.<span class="fn">string</span>().<span class="fn">required</span>(),
    PORT: Joi.<span class="fn">number</span>().<span class="fn">default</span>(<span class="num">3000</span>),
  }),
}),

<span class="cm">// Si MONGODB_URI no está definida:</span>
<span class="cm">// [Nest] ERROR ValidationError: "MONGODB_URI" is required</span>
<span class="cm">// → La app no arranca. Mucho mejor que un crash misterioso después.</span>`
      },
      quiz: {
        q: "¿Cuál es la ventaja de validar variables de entorno con Joi al inicio?",
        options: [
          "Hace la app más rápida",
          "Si falta una variable requerida, la app falla de inmediato con mensaje claro en vez de crashear misteriosamente después",
          "Es un requisito de MongoDB",
          "Evita que el .env sea leído por otros procesos"
        ],
        correct: 1,
        feedback: "Fail fast: mejor que la app no arranque con 'MONGODB_URI is required' que que arranque y falle 30 segundos después con 'MongoNetworkError: failed to connect' sin contexto de por qué."
      }
    },
    {
      heading: "Dockerizar la aplicación",
      body: `
<p>Docker empaqueta la app con todas sus dependencias en una imagen portable. Un <strong>multi-stage Dockerfile</strong> separa la etapa de build (con TypeScript y devDeps) de la etapa de producción (solo JS + deps de producción) — la imagen final es mucho más pequeña.</p>
      `,
      code: {
        lang: "dockerfile",
        label: "Dockerfile — multi-stage build",
        content: `<span class="cm"># Etapa 1: build TypeScript</span>
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

<span class="cm"># Etapa 2: imagen de producción (más pequeña)</span>
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]`
      },
      code2: {
        lang: "yaml",
        label: "docker-compose.yml — app + MongoDB juntos",
        content: `version: '3'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file: .env
    depends_on:
      - db

  db:
    image: mongo:6
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:`
      }
    }
  ]
};
