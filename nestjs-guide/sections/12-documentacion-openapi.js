export default {
  title: "Documentación — OpenAPI",
  desc: "Swagger UI integrado con NestJS: ApiProperty, ApiResponse, Tags y documentación automática de DTOs.",
  lectures: [
    {
      heading: "NestJS Swagger — setup inicial",
      body: `
<p>NestJS tiene integración oficial con Swagger a través de <code>@nestjs/swagger</code>. Con solo configurar <code>SwaggerModule</code> en <code>main.ts</code>, obtienes una UI interactiva en <code>/api</code>.</p>
<p>La documentación se genera automáticamente leyendo los decoradores de controladores, DTOs y entidades. No necesitas escribir YAML ni JSON a mano.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar y configurar",
        content: `<span class="cm"># Instalar</span>
npm install @nestjs/swagger`
      },
      code2: {
        lang: "typescript",
        label: "main.ts — setup de Swagger",
        content: `<span class="kw">import</span> { SwaggerModule, DocumentBuilder } <span class="kw">from</span> <span class="str">'@nestjs/swagger'</span>;

<span class="kw">async function</span> bootstrap() {
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.create(AppModule);

  <span class="kw">const</span> config = <span class="kw">new</span> DocumentBuilder()
    .setTitle(<span class="str">'TesloShop API'</span>)
    .setDescription(<span class="str">'Endpoints del proyecto TesloShop'</span>)
    .setVersion(<span class="str">'1.0'</span>)
    .addBearerAuth()
    .build();

  <span class="kw">const</span> document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(<span class="str">'api'</span>, app, document);

  <span class="kw">await</span> app.listen(<span class="num">3000</span>);
}`
      },
      callout: { title: "Acceder a la UI", text: "Una vez arrancado: http://localhost:3000/api — Swagger muestra todos los endpoints con sus schemas y permite ejecutarlos directamente." }
    },
    {
      heading: "Tags, ApiProperty y ApiResponse",
      body: `
<p>Los decoradores de Swagger enriquecen la documentación:</p>
<ul>
  <li><code>@ApiTags('products')</code> en el controlador — agrupa los endpoints en Swagger UI</li>
  <li><code>@ApiProperty()</code> en el DTO — documenta cada campo con tipo, ejemplo y descripción</li>
  <li><code>@ApiResponse({ status: 201, description: '...', type: Product })</code> — documenta la respuesta</li>
  <li><code>@ApiBearerAuth()</code> — indica que el endpoint requiere JWT</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "products.controller.ts — decoradores Swagger",
        content: `<span class="kw">import</span> { ApiTags, ApiResponse, ApiBearerAuth } <span class="kw">from</span> <span class="str">'@nestjs/swagger'</span>;

<span class="dec">@ApiTags</span>(<span class="str">'Products'</span>)
<span class="dec">@ApiBearerAuth</span>()
<span class="dec">@Controller</span>(<span class="str">'products'</span>)
<span class="kw">export class</span> <span class="tp">ProductsController</span> {
  <span class="dec">@Post</span>()
  <span class="dec">@ApiResponse</span>({ status: <span class="num">201</span>, description: <span class="str">'Producto creado'</span>, type: Product })
  <span class="dec">@ApiResponse</span>({ status: <span class="num">400</span>, description: <span class="str">'Bad Request'</span> })
  <span class="dec">@ApiResponse</span>({ status: <span class="num">401</span>, description: <span class="str">'Unauthorized'</span> })
  create(<span class="dec">@Body</span>() createProductDto: <span class="tp">CreateProductDto</span>) {
    <span class="kw">return this</span>.productsService.create(createProductDto);
  }
}`
      }
    },
    {
      heading: "ApiProperty en DTOs",
      body: `
<p>Para que Swagger muestre los campos del body en la UI, decora cada propiedad del DTO con <code>@ApiProperty()</code>. Sin esto, Swagger no conoce los tipos en runtime (TypeScript los borra al compilar).</p>
<p>Puedes documentar: tipo, descripción, ejemplo, si es requerido, y opciones de arrays.</p>
      `,
      code: {
        lang: "typescript",
        label: "create-product.dto.ts con ApiProperty",
        content: `<span class="kw">import</span> { ApiProperty } <span class="kw">from</span> <span class="str">'@nestjs/swagger'</span>;

<span class="kw">export class</span> <span class="tp">CreateProductDto</span> {
  <span class="dec">@ApiProperty</span>({
    example: <span class="str">'T-Shirt Teslo'</span>,
    description: <span class="str">'Nombre del producto'</span>,
    uniqueItems: <span class="kw">true</span>,
  })
  <span class="dec">@IsString</span>()
  title: <span class="tp">string</span>;

  <span class="dec">@ApiProperty</span>({ example: <span class="num">49.99</span>, required: <span class="kw">false</span> })
  <span class="dec">@IsNumber</span>()
  <span class="dec">@IsOptional</span>()
  price?: <span class="tp">number</span>;

  <span class="dec">@ApiProperty</span>({ example: [<span class="str">'XS'</span>, <span class="str">'S'</span>, <span class="str">'M'</span>], isArray: <span class="kw">true</span>, required: <span class="kw">false</span> })
  <span class="dec">@IsArray</span>()
  <span class="dec">@IsOptional</span>()
  sizes?: <span class="tp">string</span>[];
}`
      },
      quiz: {
        q: "¿Por qué @ApiProperty() no es redundante con los tipos de TypeScript?",
        options: [
          "TypeScript y Swagger usan sistemas de tipos distintos",
          "TypeScript borra los tipos en runtime — Swagger los necesita en runtime para generar el schema",
          "@ApiProperty() sí es redundante, solo sirve para añadir ejemplos",
          "Swagger lee directamente los archivos .ts"
        ],
        correct: 1,
        feedback: "TypeScript es un sistema de tipos estáticos que desaparece al compilar. En runtime, el JS resultante no tiene información de tipos. Swagger necesita esa información en runtime para generar el JSON Schema del body — @ApiProperty() es la forma de proveerla."
      }
    },
    {
      heading: "PartialType de Swagger en lugar de @nestjs/mapped-types",
      body: `
<p>Si usas Swagger, cambia la importación de <code>PartialType</code> de <code>@nestjs/mapped-types</code> a <code>@nestjs/swagger</code>. La versión de Swagger hereda los <code>@ApiProperty()</code> del DTO padre, lo que documenta automáticamente el DTO de actualización.</p>
      `,
      code: {
        lang: "typescript",
        label: "update-product.dto.ts — PartialType de Swagger",
        content: `<span class="cm">// Antes (sin Swagger)</span>
<span class="kw">import</span> { PartialType } <span class="kw">from</span> <span class="str">'@nestjs/mapped-types'</span>;

<span class="cm">// Después (con Swagger — hereda @ApiProperty)</span>
<span class="kw">import</span> { PartialType } <span class="kw">from</span> <span class="str">'@nestjs/swagger'</span>;

<span class="kw">export class</span> <span class="tp">UpdateProductDto</span> <span class="kw">extends</span> PartialType(<span class="tp">CreateProductDto</span>) {}`
      },
      callout: { title: "Una línea, documentación completa", text: "PartialType de Swagger hace todos los campos opcionales Y los expone en Swagger UI con sus ejemplos y descripciones — sin repetir nada." }
    }
  ]
};
