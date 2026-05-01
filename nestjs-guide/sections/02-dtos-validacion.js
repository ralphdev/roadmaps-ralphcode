export default {
  title: "DTOs y Validación de información",
  desc: "Define la forma exacta de los datos que entran a tu API. Con class-validator, NestJS valida y rechaza automáticamente datos inválidos antes de que lleguen al servicio.",
  lectures: [
    {
      heading: "Interfaces y UUID",
      body: `
<p>Antes de los DTOs, es útil definir una <strong>interface</strong> que describa la forma de un carro en la app. Las interfaces de TypeScript son contratos de tipo — existen solo en compilación, no en runtime.</p>
<p>Además, cambiamos los IDs numéricos por <strong>UUID</strong> (Universally Unique Identifier). Un UUID como <code>550e8400-e29b-41d4-a716-446655440000</code> no revela cuántos registros tienes y es prácticamente único en el universo.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar uuid",
        content: `npm install uuid
npm install -D @types/uuid`
      },
      code2: {
        lang: "typescript",
        label: "interfaces/car.interface.ts + servicio con UUID",
        content: `<span class="cm">// src/cars/interfaces/car.interface.ts</span>
<span class="kw">export interface</span> <span class="tp">Car</span> {
  id: <span class="tp">string</span>;    <span class="cm">// UUID v4</span>
  brand: <span class="tp">string</span>;
  model: <span class="tp">string</span>;
}

<span class="cm">// cars.service.ts</span>
<span class="kw">import</span> { v4 <span class="kw">as</span> uuid } <span class="kw">from</span> <span class="str">'uuid'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">CarsService</span> {
  <span class="kw">private</span> cars: <span class="tp">Car</span>[] = [
    { id: <span class="fn">uuid</span>(), brand: <span class="str">'Toyota'</span>, model: <span class="str">'Corolla'</span> },
    { id: <span class="fn">uuid</span>(), brand: <span class="str">'Honda'</span>,  model: <span class="str">'Civic'</span>   },
  ];

  <span class="fn">findOne</span>(id: <span class="tp">string</span>) {
    <span class="kw">const</span> car = <span class="kw">this</span>.cars.<span class="fn">find</span>(c => c.id === id);
    <span class="kw">if</span> (!car) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Car \${id} not found\`</span>);
    <span class="kw">return</span> car;
  }
}`
      }
    },
    {
      heading: "ParseUUIDPipe",
      body: `
<p>Con IDs de tipo UUID, necesitas validar que el parámetro recibido sea efectivamente un UUID válido. <code>ParseUUIDPipe</code> hace exactamente eso: si el formato no es un UUID v4, responde 400 automáticamente antes de entrar al controlador.</p>
      `,
      code: {
        lang: "typescript",
        label: "ParseUUIDPipe — validar formato UUID en :id",
        content: `<span class="kw">import</span> { Controller, Get, Param, ParseUUIDPipe } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Controller</span>(<span class="str">'cars'</span>)
<span class="kw">export class</span> <span class="tp">CarsController</span> {

  <span class="dec">@Get</span>(<span class="str">':id'</span>)
  <span class="fn">findOne</span>(<span class="dec">@Param</span>(<span class="str">'id'</span>, ParseUUIDPipe) id: <span class="tp">string</span>) {
    <span class="cm">// GET /cars/not-a-uuid          → 400 Bad Request</span>
    <span class="cm">// GET /cars/550e8400-e29b-...    → OK, pasa al servicio</span>
    <span class="kw">return this</span>.carsService.<span class="fn">findOne</span>(id);
  }
}`
      },
      quiz: {
        q: "¿Qué ventaja tienen los UUIDs sobre los IDs numéricos secuenciales?",
        options: [
          "Los UUID son más rápidos en consultas SQL",
          "No revelan el volumen de datos y son únicos globalmente",
          "Son más fáciles de escribir en URLs",
          "TypeScript los valida automáticamente"
        ],
        correct: 1,
        feedback: "Con ID=5, el cliente sabe que hay al menos 5 registros. Con UUID eso no es posible. Además, los UUID son únicos globalmente — útil en sistemas distribuidos o al mergear datos de múltiples fuentes."
      }
    },
    {
      heading: "DTO — Data Transfer Object",
      body: `
<p>Un DTO define exactamente qué campos esperas en el body de una petición. Es una clase TypeScript con decoradores de validación de <code>class-validator</code>.</p>
<p>Con un DTO tipado:</p>
<ul>
  <li>El IDE autocompleta los campos disponibles.</li>
  <li>TypeScript detecta errores de tipo en compilación.</li>
  <li>class-validator valida los valores en runtime antes de que lleguen al servicio.</li>
</ul>
      `,
      code: {
        lang: "bash",
        label: "Instalar dependencias de validación",
        content: `npm install class-validator class-transformer`
      },
      code2: {
        lang: "typescript",
        label: "dtos/create-car.dto.ts",
        content: `<span class="kw">import</span> { IsString, MinLength, IsNotEmpty } <span class="kw">from</span> <span class="str">'class-validator'</span>;

<span class="kw">export class</span> <span class="tp">CreateCarDto</span> {
  <span class="dec">@IsString</span>()
  <span class="dec">@IsNotEmpty</span>()
  <span class="dec">@MinLength</span>(<span class="num">2</span>)
  <span class="kw">readonly</span> brand: <span class="tp">string</span>;

  <span class="dec">@IsString</span>()
  <span class="dec">@IsNotEmpty</span>()
  <span class="kw">readonly</span> model: <span class="tp">string</span>;
}

<span class="cm">// cars.controller.ts — usar el DTO en @Body()</span>
<span class="dec">@Post</span>()
<span class="fn">create</span>(<span class="dec">@Body</span>() createCarDto: <span class="tp">CreateCarDto</span>) {
  <span class="kw">return this</span>.carsService.<span class="fn">create</span>(createCarDto);
}`
      },
      quiz: {
        q: "Si el cliente envía { brand: 123, model: 'Civic' }, ¿qué ocurre con @IsString() en brand?",
        options: [
          "brand se convierte a '123' automáticamente",
          "NestJS responde 400 porque 123 no es string",
          "El dato llega al servicio sin validación",
          "TypeScript lo detecta en tiempo de compilación"
        ],
        correct: 1,
        feedback: "Con ValidationPipe activo y @IsString() en brand, NestJS valida en runtime que brand sea string. 123 (number) falla → 400 Bad Request con un mensaje detallado del error."
      }
    },
    {
      heading: "ValidationPipe — Pipes globales",
      body: `
<p>Los decoradores de class-validator no hacen nada solos. Necesitas activar <code>ValidationPipe</code> en <code>main.ts</code> para que NestJS los ejecute antes de cada petición.</p>
<p>Al activarlo globalmente aplica a todos los endpoints de la app automáticamente.</p>
      `,
      code: {
        lang: "typescript",
        label: "main.ts — activar ValidationPipe global",
        content: `<span class="kw">import</span> { ValidationPipe } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>(AppModule);

  app.<span class="fn">useGlobalPipes</span>(<span class="kw">new</span> <span class="fn">ValidationPipe</span>({
    whitelist: <span class="kw">true</span>,             <span class="cm">// elimina campos no declarados en el DTO</span>
    forbidNonWhitelisted: <span class="kw">true</span>,  <span class="cm">// 400 si llegan campos extra</span>
    transform: <span class="kw">true</span>,             <span class="cm">// convierte tipos automáticamente</span>
  }));

  <span class="kw">await</span> app.<span class="fn">listen</span>(<span class="num">3000</span>);
}

<span class="cm">// Si envías { brand: '', model: 'Civic', isAdmin: true }:</span>
<span class="cm">// → 400 (brand vacío falla @IsNotEmpty)</span>
<span class="cm">// → isAdmin eliminado por whitelist: true</span>`
      },
      callout: { title: "whitelist: true es seguridad gratuita", text: "Si un cliente envía isAdmin: true esperando saltarse permisos, con whitelist: true ese campo se elimina silenciosamente antes de llegar al servicio. Una capa de defensa sencilla pero efectiva." }
    },
    {
      heading: "UpdateCarDto — Actualización parcial con PartialType",
      body: `
<p>Para PATCH (actualización parcial), los campos son opcionales — el cliente puede enviar solo los que quiere cambiar. En vez de duplicar el DTO, usas <code>PartialType</code>: hereda todos los campos de CreateCarDto y los hace opcionales, manteniendo las validaciones.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar @nestjs/mapped-types",
        content: `npm install @nestjs/mapped-types`
      },
      code2: {
        lang: "typescript",
        label: "dtos/update-car.dto.ts + service.update()",
        content: `<span class="kw">import</span> { PartialType } <span class="kw">from</span> <span class="str">'@nestjs/mapped-types'</span>;
<span class="kw">import</span> { CreateCarDto } <span class="kw">from</span> <span class="str">'./create-car.dto'</span>;

<span class="cm">// Hereda brand y model de CreateCarDto pero ambos son opcionales</span>
<span class="kw">export class</span> <span class="tp">UpdateCarDto</span> <span class="kw">extends</span> <span class="tp">PartialType</span>(CreateCarDto) {}

<span class="cm">// cars.service.ts — actualizar carro</span>
<span class="fn">update</span>(id: <span class="tp">string</span>, updateCarDto: <span class="tp">UpdateCarDto</span>) {
  <span class="kw">const</span> car = <span class="kw">this</span>.<span class="fn">findOne</span>(id); <span class="cm">// lanza 404 si no existe</span>
  <span class="kw">this</span>.cars = <span class="kw">this</span>.cars.<span class="fn">map</span>(c =>
    c.id === id ? { ...c, ...updateCarDto, id } : c
  );
  <span class="kw">return this</span>.<span class="fn">findOne</span>(id);
}

<span class="cm">// PATCH /cars/:id con { model: 'Civic Type R' }</span>
<span class="cm">// Solo actualiza model, brand queda igual</span>`
      },
      quiz: {
        q: "¿Qué hace PartialType(CreateCarDto)?",
        options: [
          "Crea un DTO sin ninguna validación",
          "Hereda todos los campos de CreateCarDto y los hace opcionales, manteniendo las validaciones",
          "Elimina algunos campos del DTO original",
          "Es solo un alias sin efecto real"
        ],
        correct: 1,
        feedback: "PartialType itera todos los campos del DTO origen y los marca como opcionales (?). Mantiene todos los decoradores de class-validator — si un campo se envía, se valida igual."
      }
    }
  ]
};
