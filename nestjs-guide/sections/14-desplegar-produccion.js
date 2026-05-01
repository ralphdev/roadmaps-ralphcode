export default {
  title: "Desplegar a producción",
  desc: "PostgreSQL en la nube con NeonTech, deploy del backend en Render y del frontend Vite en Render Static Sites.",
  lectures: [
    {
      heading: "PostgreSQL en la nube — NeonTech",
      body: `
<p><strong>Neon</strong> es una base de datos PostgreSQL serverless. Tiene capa gratuita generosa, se aprovisiona en segundos y provee una cadena de conexión lista para usar en cualquier ORM.</p>
<p>El flujo:</p>
<ol>
  <li>Crear cuenta en neon.tech</li>
  <li>Crear un proyecto y una base de datos</li>
  <li>Copiar la connection string (incluye host, usuario, password y DB)</li>
  <li>Configurar esa URL como variable de entorno en el backend</li>
</ol>
      `,
      code: {
        lang: "bash",
        label: "Variables de entorno para Neon",
        content: `<span class="cm"># .env — reemplaza con tus credenciales de Neon</span>
DB_HOST=ep-xxx.us-east-2.aws.neon.tech
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_datos
DB_SSL=true`
      },
      code2: {
        lang: "typescript",
        label: "TypeORM config — SSL para Neon",
        content: `TypeOrmModule.forRoot({
  type: <span class="str">'postgres'</span>,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === <span class="str">'true'</span>
    ? { rejectUnauthorized: <span class="kw">false</span> }
    : <span class="kw">false</span>,
  autoLoadEntities: <span class="kw">true</span>,
  synchronize: <span class="kw">false</span>, <span class="cm">// NUNCA true en producción</span>
})`
      },
      callout: { title: "synchronize: false en producción", text: "synchronize: true modifica el schema automáticamente — en producción eso puede borrar columnas. Usa migraciones de TypeORM para controlar los cambios." }
    },
    {
      heading: "Desplegar backend en Render",
      body: `
<p><strong>Render</strong> despliega aplicaciones Node.js desde GitHub con CI/CD automático. Cada push a la rama configurada dispara un nuevo deploy.</p>
<p>Pasos:</p>
<ol>
  <li>Crear cuenta en render.com</li>
  <li>New → Web Service → conectar repo GitHub</li>
  <li>Build Command: <code>npm install && npm run build</code></li>
  <li>Start Command: <code>node dist/main</code></li>
  <li>Agregar variables de entorno en Environment</li>
</ol>
      `,
      code: {
        lang: "json",
        label: "package.json — scripts de producción",
        content: `{
  <span class="str">"scripts"</span>: {
    <span class="str">"build"</span>: <span class="str">"nest build"</span>,
    <span class="str">"start:prod"</span>: <span class="str">"node dist/main"</span>
  }
}`
      },
      callout: { title: "PORT en Render", text: "Render asigna el puerto dinámicamente vía la variable PORT. Asegúrate de usar: app.listen(process.env.PORT ?? 3000)" }
    },
    {
      heading: "Desplegar frontend Vite en Render Static Sites",
      body: `
<p>El frontend Vite (cliente WebSocket) se despliega como <strong>Static Site</strong> en Render — sin servidor, solo archivos estáticos. Es gratis y tiene CDN global.</p>
<p>El único truco: configurar el <strong>redirect rule</strong> para que todas las rutas apunten a <code>index.html</code> (necesario para SPAs con routing del lado del cliente).</p>
      `,
      code: {
        lang: "bash",
        label: "Configuración en Render — Static Site",
        content: `<span class="cm"># Build Command</span>
npm install && npm run build

<span class="cm"># Publish Directory</span>
dist

<span class="cm"># Redirect Rule (para SPAs)</span>
<span class="cm"># Source: /*    Destination: /index.html    Status: 200</span>`
      },
      code2: {
        lang: "typescript",
        label: "Configurar URL del backend en Vite — .env",
        content: `<span class="cm"># .env.production</span>
VITE_API_URL=https://tu-backend.onrender.com

<span class="cm"># En el código — usar la variable</span>
<span class="kw">const</span> socket = io(<span class="kw">import</span>.meta.env.VITE_API_URL);`
      },
      quiz: {
        q: "¿Por qué synchronize: false es obligatorio en una base de datos de producción?",
        options: [
          "Porque Render no soporta synchronize: true",
          "Porque synchronize: true puede alterar o eliminar columnas/tablas automáticamente al arrancar",
          "Porque TypeORM no soporta synchronize en producción",
          "Por razones de rendimiento — las queries son más lentas"
        ],
        correct: 1,
        feedback: "Con synchronize: true, TypeORM compara las entidades con el schema real de la DB y aplica cambios automáticamente. En desarrollo está bien. En producción, un cambio de entidad puede borrar una columna con datos reales. Las migraciones dan control explícito sobre cada cambio."
      }
    }
  ]
};
