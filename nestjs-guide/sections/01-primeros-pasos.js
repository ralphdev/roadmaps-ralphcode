export default {
  title: "Primeros pasos en Nest",
  desc: "Instalación del CLI, creación del proyecto CarDealership y los bloques fundamentales: módulos, controladores, servicios, pipes y exception filters.",
  lectures: [
    {
      heading: "¿Qué es Nest? y ¿Por qué usarlo?",
      body: `
<p>NestJS es un framework de Node.js para construir aplicaciones servidor escalables. Está escrito en TypeScript y usa decoradores, inyección de dependencias y arquitectura modular inspirada en Angular.</p>
<p>¿Por qué elegir NestJS sobre Express?</p>
<ul>
  <li><strong>Estructura forzada</strong>: módulos, controladores y servicios tienen roles claros. El proyecto escala sin convertirse en caos.</li>
  <li><strong>TypeScript nativo</strong>: autocompletado completo, errores en compilación, refactors seguros.</li>
  <li><strong>DI integrada</strong>: NestJS gestiona las dependencias entre clases — tú declaras qué necesitas, él lo conecta.</li>
  <li><strong>Ecosistema oficial</strong>: TypeORM, Mongoose, GraphQL, WebSockets, microservicios, JWT, Swagger — todo con módulos oficiales.</li>
</ul>
<p>Express da libertad sin estructura. NestJS da estructura sin perder la potencia de Node.js.</p>
      `,
      callout: { title: "Proyecto del curso", text: "En esta sección construyes CarDealership: una API REST para gestionar un inventario de carros. Simple pero completo — usa todos los conceptos fundamentales de NestJS." },
      quiz: {
        q: "¿Cuál es la diferencia principal entre Express y NestJS?",
        options: [
          "Express es más rápido en runtime",
          "NestJS impone arquitectura modular; Express no tiene opinión sobre la estructura",
          "NestJS no soporta middleware de Express",
          "Express requiere TypeScript obligatoriamente"
        ],
        correct: 1,
        feedback: "Express es minimalista: decides tú cómo organizar todo. NestJS te da módulos, controladores, servicios e inyección de dependencias desde el inicio. Esa estructura es lo que permite que el proyecto escale sin convertirse en spaghetti."
      }
    },
    {
      heading: "Instalar Nest CLI y crear CarDealership",
      body: `
<p>El CLI de NestJS automatiza la creación de proyectos y la generación de archivos. Se instala globalmente una sola vez en tu máquina.</p>
<p>Al crear el proyecto con <code>nest new</code>, el CLI genera toda la estructura inicial y configura TypeScript, ESLint y Prettier automáticamente.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar CLI y crear el proyecto",
        content: `<span class="cm"># Instalar CLI globalmente (una sola vez)</span>
npm install -g @nestjs/cli

<span class="cm"># Crear proyecto CarDealership</span>
nest new car-dealership
<span class="cm"># Elige npm cuando pregunta el gestor de paquetes</span>

<span class="cm"># Entrar y arrancar en modo desarrollo</span>
cd car-dealership
npm run start:dev
<span class="cm"># → http://localhost:3000 responde "Hello World!"</span>`
      },
      callout: { title: "Verifica la instalación", text: "Abre http://localhost:3000 en el navegador. 'Hello World!' confirma que todo funciona. Viene del AppController que NestJS genera automáticamente." }
    },
    {
      heading: "Explicación de cada archivo y directorio",
      body: `
<p>NestJS genera una estructura inicial. Los archivos que importan desde el principio:</p>
<ul>
  <li><strong>src/main.ts</strong>: entry point. Crea la app con <code>NestFactory</code> y la pone a escuchar en un puerto.</li>
  <li><strong>src/app.module.ts</strong>: módulo raíz. Todos los demás módulos se registran aquí.</li>
  <li><strong>src/app.controller.ts</strong>: controlador de ejemplo con GET / → "Hello World!".</li>
  <li><strong>src/app.service.ts</strong>: servicio de ejemplo con la lógica del controlador.</li>
  <li><strong>nest-cli.json</strong>: configuración del CLI (sourceRoot, build options, assets).</li>
  <li><strong>tsconfig.json</strong>: TypeScript con decoradores habilitados (<code>experimentalDecorators: true</code>).</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "src/main.ts — punto de entrada",
        content: `<span class="kw">import</span> { NestFactory } <span class="kw">from</span> <span class="str">'@nestjs/core'</span>;
<span class="kw">import</span> { AppModule } <span class="kw">from</span> <span class="str">'./app.module'</span>;

<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="cm">// Construye el grafo de dependencias desde AppModule</span>
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>(AppModule);
  <span class="kw">await</span> app.<span class="fn">listen</span>(<span class="num">3000</span>);
}

<span class="fn">bootstrap</span>();`
      },
      code2: {
        lang: "typescript",
        label: "src/app.module.ts — módulo raíz",
        content: `<span class="kw">import</span> { Module } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { AppController } <span class="kw">from</span> <span class="str">'./app.controller'</span>;
<span class="kw">import</span> { AppService } <span class="kw">from</span> <span class="str">'./app.service'</span>;

<span class="dec">@Module</span>({
  imports: [],                   <span class="cm">// otros módulos que este necesita</span>
  controllers: [AppController],  <span class="cm">// controladores de este módulo</span>
  providers: [AppService],       <span class="cm">// servicios disponibles aquí</span>
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
      },
      quiz: {
        q: "¿Cuál es el archivo que NestJS ejecuta primero cuando arranca?",
        options: ["app.module.ts", "app.controller.ts", "main.ts", "nest-cli.json"],
        correct: 2,
        feedback: "main.ts es el entry point. Llama a bootstrap() → NestFactory.create(AppModule) construye el grafo de dependencias → listen(3000) abre el puerto. Los demás archivos son módulos que el framework carga internamente."
      }
    },
    {
      heading: "Módulos",
      body: `
<p>Un módulo es el contenedor que agrupa funcionalidades relacionadas. Toda app NestJS tiene al menos un módulo: <strong>AppModule</strong> (el raíz).</p>
<p>Para CarDealership crearás un módulo <code>cars</code>. El CLI genera el archivo y lo registra automáticamente en AppModule dentro de <code>imports</code>.</p>
      `,
      code: {
        lang: "bash",
        label: "Generar módulo cars",
        content: `<span class="cm"># Genera src/cars/cars.module.ts</span>
<span class="cm"># Y actualiza app.module.ts automáticamente</span>
nest generate module cars
<span class="cm"># shorthand: nest g mo cars</span>`
      },
      code2: {
        lang: "typescript",
        label: "src/cars/cars.module.ts generado",
        content: `<span class="kw">import</span> { Module } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Module</span>({
  controllers: [],  <span class="cm">// se llenará cuando generes el controlador</span>
  providers: [],    <span class="cm">// se llenará cuando generes el servicio</span>
})
<span class="kw">export class</span> <span class="tp">CarsModule</span> {}`
      }
    },
    {
      heading: "Controladores",
      body: `
<p>El controlador recibe peticiones HTTP y devuelve respuestas. <strong>Solo eso</strong> — no tiene lógica de negocio ni acceso a datos.</p>
<p><code>@Controller('cars')</code> define el prefijo de ruta. Todos los métodos de esa clase tendrán rutas que empiezan con <code>/cars</code>.</p>
      `,
      code: {
        lang: "bash",
        label: "Generar controlador",
        content: `<span class="cm"># Genera cars.controller.ts y cars.controller.spec.ts</span>
<span class="cm"># Registra CarsController en CarsModule automáticamente</span>
nest generate controller cars
<span class="cm"># shorthand: nest g co cars</span>`
      },
      code2: {
        lang: "typescript",
        label: "cars.controller.ts — rutas GET",
        content: `<span class="kw">import</span> { Controller, Get, Param } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Controller</span>(<span class="str">'cars'</span>)
<span class="kw">export class</span> <span class="tp">CarsController</span> {

  <span class="dec">@Get</span>()           <span class="cm">// GET /cars</span>
  <span class="fn">findAll</span>() {
    <span class="kw">return</span> [<span class="str">'Toyota Corolla'</span>, <span class="str">'Honda Civic'</span>];
  }

  <span class="dec">@Get</span>(<span class="str">':id'</span>)      <span class="cm">// GET /cars/1</span>
  <span class="fn">findOne</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>) {
    <span class="kw">return</span> <span class="str">\`Car with id \${id}\`</span>;
  }
}`
      },
      callout: { title: "Regla del controlador", text: "Si hay lógica de negocio en el controlador (cálculos, validaciones, acceso a datos), está en el lugar incorrecto. El controlador solo recibe la petición, llama al servicio y devuelve la respuesta." }
    },
    {
      heading: "Servicios e Inyección de dependencias",
      body: `
<p>El servicio contiene la lógica de negocio. El decorador <code>@Injectable()</code> marca la clase para que el sistema de inyección de dependencias (DI) de NestJS la gestione.</p>
<p><strong>DI</strong>: en lugar de hacer <code>new CarsService()</code> manualmente, declaras el servicio en el constructor del controlador y NestJS lo crea e inyecta automáticamente. La instancia se comparte (singleton por defecto).</p>
      `,
      code: {
        lang: "typescript",
        label: "cars.service.ts — lógica de negocio",
        content: `<span class="kw">import</span> { Injectable, NotFoundException } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">CarsService</span> {
  <span class="kw">private</span> cars = [
    { id: <span class="num">1</span>, brand: <span class="str">'Toyota'</span>, model: <span class="str">'Corolla'</span> },
    { id: <span class="num">2</span>, brand: <span class="str">'Honda'</span>,  model: <span class="str">'Civic'</span>   },
  ];

  <span class="fn">findAll</span>() { <span class="kw">return this</span>.cars; }

  <span class="fn">findOne</span>(id: <span class="tp">number</span>) {
    <span class="kw">const</span> car = <span class="kw">this</span>.cars.<span class="fn">find</span>(c => c.id === id);
    <span class="kw">if</span> (!car) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Car #\${id} not found\`</span>);
    <span class="kw">return</span> car;
  }
}`
      },
      code2: {
        lang: "typescript",
        label: "cars.controller.ts — inyectar el servicio",
        content: `<span class="kw">import</span> { Controller, Get, Param } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { CarsService } <span class="kw">from</span> <span class="str">'./cars.service'</span>;

<span class="dec">@Controller</span>(<span class="str">'cars'</span>)
<span class="kw">export class</span> <span class="tp">CarsController</span> {
  <span class="cm">// TypeScript shorthand: crea y asigna this.carsService en un paso</span>
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> carsService: <span class="tp">CarsService</span>) {}

  <span class="dec">@Get</span>()
  <span class="fn">findAll</span>() { <span class="kw">return this</span>.carsService.<span class="fn">findAll</span>(); }

  <span class="dec">@Get</span>(<span class="str">':id'</span>)
  <span class="fn">findOne</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>) id: <span class="tp">string</span>) {
    <span class="kw">return this</span>.carsService.<span class="fn">findOne</span>(+id); <span class="cm">// +id = string a number</span>
  }
}`
      },
      quiz: {
        q: "¿Por qué NestJS puede inyectar CarsService automáticamente?",
        options: [
          "Porque el archivo se llama cars.service.ts",
          "Porque tiene @Injectable() y está en providers del módulo",
          "Porque es una clase TypeScript normal",
          "NestJS inyecta cualquier clase que esté en src/"
        ],
        correct: 1,
        feedback: "@Injectable() registra la clase en el sistema de DI. Al estar en 'providers' del módulo, NestJS sabe cómo crearla y puede inyectarla en el constructor del controlador cuando lo necesita."
      }
    },
    {
      heading: "Pipes y Exception Filters",
      body: `
<p><strong>Pipes</strong> transforman o validan datos antes de que lleguen al controlador. El más útil al inicio: <code>ParseIntPipe</code> — convierte el parámetro de string a number. Si no es convertible, 400 automático.</p>
<p><strong>Exception Filters</strong> atrapan excepciones y las convierten en respuestas HTTP. NestJS tiene uno global que convierte <code>NotFoundException</code>, <code>BadRequestException</code> y similares en JSON con el código correcto — sin que hagas nada extra.</p>
      `,
      code: {
        lang: "typescript",
        label: "ParseIntPipe + NotFoundException en acción",
        content: `<span class="kw">import</span> { Controller, Get, Param, ParseIntPipe } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Controller</span>(<span class="str">'cars'</span>)
<span class="kw">export class</span> <span class="tp">CarsController</span> {

  <span class="dec">@Get</span>(<span class="str">':id'</span>)
  <span class="fn">findOne</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>, ParseIntPipe) id: <span class="tp">number</span>) {
    <span class="cm">// GET /cars/abc → 400 Bad Request (ParseIntPipe lo rechaza)</span>
    <span class="cm">// GET /cars/99  → 404 Not Found (NotFoundException del servicio)</span>
    <span class="cm">// GET /cars/1   → 200 OK con el carro</span>
    <span class="kw">return this</span>.carsService.<span class="fn">findOne</span>(id);
  }
}`
      },
      quiz: {
        q: "Si envías GET /cars/abc con ParseIntPipe, ¿qué responde NestJS?",
        options: [
          "id llega como NaN al servicio",
          "400 Bad Request — antes de entrar al controlador",
          "El pipe convierte 'abc' a 0",
          "500 Internal Server Error"
        ],
        correct: 1,
        feedback: "ParseIntPipe valida que el valor sea convertible a entero. 'abc' no lo es → lanza BadRequestException (400) antes de que la petición llegue al método del controlador."
      }
    },
    {
      heading: "POST, PATCH y DELETE",
      body: `
<p>Completamos el CRUD de CarDealership. El body de la petición llega con <code>@Body()</code>. Por ahora el tipo es <code>any</code> — en la siguiente sección lo reemplazaremos con DTOs tipados.</p>
      `,
      code: {
        lang: "typescript",
        label: "CRUD completo — cars.controller.ts",
        content: `<span class="kw">import</span> { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Controller</span>(<span class="str">'cars'</span>)
<span class="kw">export class</span> <span class="tp">CarsController</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> carsService: <span class="tp">CarsService</span>) {}

  <span class="dec">@Get</span>()                                   <span class="cm">// GET    /cars</span>
  <span class="fn">findAll</span>() { <span class="kw">return this</span>.carsService.<span class="fn">findAll</span>(); }

  <span class="dec">@Get</span>(<span class="str">':id'</span>)                              <span class="cm">// GET    /cars/:id</span>
  <span class="fn">findOne</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>, ParseIntPipe) id: <span class="tp">number</span>) {
    <span class="kw">return this</span>.carsService.<span class="fn">findOne</span>(id);
  }

  <span class="dec">@Post</span>()                                  <span class="cm">// POST   /cars</span>
  <span class="fn">create</span>(<span class="dec">@Body</span>() createCarDto: <span class="kw">any</span>) {
    <span class="kw">return this</span>.carsService.<span class="fn">create</span>(createCarDto);
  }

  <span class="dec">@Patch</span>(<span class="str">':id'</span>)                           <span class="cm">// PATCH  /cars/:id</span>
  <span class="fn">update</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>, ParseIntPipe) id: <span class="tp">number</span>, <span class="dec">@Body</span>() body: <span class="kw">any</span>) {
    <span class="kw">return this</span>.carsService.<span class="fn">update</span>(id, body);
  }

  <span class="dec">@Delete</span>(<span class="str">':id'</span>)                          <span class="cm">// DELETE /cars/:id</span>
  <span class="fn">remove</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>, ParseIntPipe) id: <span class="tp">number</span>) {
    <span class="kw">return this</span>.carsService.<span class="fn">remove</span>(id);
  }
}`
      },
      callout: { title: "any es temporal", text: "Usar 'any' en el body acepta cualquier dato sin validación. La siguiente sección introduce DTOs con class-validator — el estándar en NestJS para tipar y validar inputs." }
    }
  ]
};
