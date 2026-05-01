export default {
  title: "Generar build de producción básico",
  desc: "Compila TypeScript a JavaScript optimizado listo para producción. Entiende la diferencia entre modo desarrollo y modo producción en NestJS.",
  lectures: [
    {
      heading: "Build de producción",
      body: `
<p>En desarrollo usas <code>npm run start:dev</code> que compila en memoria con ts-node y se reinicia al guardar. En producción compilas TypeScript a JavaScript una vez y corres el JS resultante.</p>
<p>El comando <code>nest build</code> (o <code>npm run build</code>) compila todo a la carpeta <code>dist/</code>. En producción corres <code>node dist/main.js</code>.</p>
      `,
      code: {
        lang: "bash",
        label: "Compilar y ejecutar en producción",
        content: `<span class="cm"># Compilar TypeScript → JavaScript (en dist/)</span>
npm run build

<span class="cm"># Correr el JS compilado en producción</span>
node dist/main.js

<span class="cm"># O con el script de NestJS:</span>
npm run start:prod

<span class="cm"># Scripts disponibles en package.json:</span>
<span class="cm"># start       → node dist/main.js</span>
<span class="cm"># start:dev   → nestjs build --watch + ts-node</span>
<span class="cm"># start:debug → igual pero con inspector de Node</span>
<span class="cm"># start:prod  → node dist/main.js</span>
<span class="cm"># build       → nest build</span>`
      },
      callout: { title: "dist/ en .gitignore", text: "La carpeta dist/ contiene código generado — no la commitees. El .gitignore que NestJS genera ya la incluye por defecto. En producción se genera en el servidor con 'npm run build'." }
    },
    {
      heading: "Variables de entorno en el build",
      body: `
<p>Antes de hacer el primer build real, asegúrate de que el puerto y las configuraciones no estén hardcodeadas. Una app de producción debe leer el puerto desde variables de entorno.</p>
      `,
      code: {
        lang: "typescript",
        label: "main.ts — puerto dinámico",
        content: `<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>(AppModule);

  <span class="cm">// Lee PORT de variables de entorno, default 3000</span>
  <span class="kw">const</span> port = process.env.PORT ?? <span class="num">3000</span>;
  <span class="kw">await</span> app.<span class="fn">listen</span>(port);

  console.<span class="fn">log</span>(<span class="str">\`Application running on port \${port}\`</span>);
}
<span class="fn">bootstrap</span>();

<span class="cm"># En producción:</span>
<span class="cm">PORT=8080 node dist/main.js</span>`
      },
      quiz: {
        q: "¿Por qué NO hardcodear el puerto en main.ts para producción?",
        options: [
          "NestJS no permite números hardcodeados",
          "Diferentes entornos (staging, prod) usan puertos distintos — con env var no cambias código",
          "node dist/main.js no acepta argumentos",
          "Es solo una convención estética"
        ],
        correct: 1,
        feedback: "Con variables de entorno, el mismo build corre en cualquier entorno (staging en 8080, producción en 80, tests en 3001) sin tocar código. Hardcodear el puerto obliga a recompilar para cambiar entornos."
      }
    }
  ]
};
