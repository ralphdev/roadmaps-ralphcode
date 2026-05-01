export default {
  title: "TypeORM — Postgres",
  desc: "Nuevo proyecto TesloShop: API de e-commerce con PostgreSQL y TypeORM. Entidades, relaciones, QueryBuilder, BeforeInsert/Update y manejo de errores de BD.",
  lectures: [
    {
      heading: "Inicio del proyecto TesloShop y conexión con Postgres",
      body: `
<p>TesloShop es una API de tienda de vehículos eléctricos (inspirada en Tesla). Usarás PostgreSQL con TypeORM — el ORM más popular en el ecosistema NestJS para SQL.</p>
<p>Arrancas Postgres con Docker para no instalarlo localmente.</p>
      `,
      code: {
        lang: "bash",
        label: "Docker Postgres + instalar TypeORM",
        content: `<span class="cm"># docker-compose.yml</span>
<span class="cm">version: '3'</span>
<span class="cm">services:</span>
<span class="cm">  db:</span>
<span class="cm">    image: postgres:15</span>
<span class="cm">    environment:</span>
<span class="cm">      POSTGRES_PASSWORD: mypassword</span>
<span class="cm">      POSTGRES_DB: TesloDB</span>
<span class="cm">    ports:</span>
<span class="cm">      - '5432:5432'</span>

<span class="cm"># Instalar dependencias</span>
npm install @nestjs/typeorm typeorm pg`
      },
      code2: {
        lang: "typescript",
        label: "app.module.ts — conectar TypeORM con Postgres",
        content: `<span class="kw">import</span> { TypeOrmModule } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;

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
          autoLoadEntities: <span class="kw">true</span>,
          synchronize: <span class="kw">true</span>, <span class="cm">// ⚠️ solo desarrollo</span>
        };
      },
      inject: [ConfigService],
    }),
  ],
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
      },
      callout: { title: "synchronize: true solo en desarrollo", text: "Con synchronize: true, TypeORM modifica el schema de la BD automáticamente al cambiar las entidades. En producción esto puede borrar datos — usa migraciones con 'synchronize: false'." }
    },
    {
      heading: "Entidades y Columnas",
      body: `
<p>Una <strong>Entity</strong> es una clase TypeScript que mapea a una tabla en la BD. Cada propiedad decorada con <code>@Column()</code> es una columna. TypeORM crea la tabla automáticamente (con synchronize: true).</p>
      `,
      code: {
        lang: "typescript",
        label: "products/entities/product.entity.ts",
        content: `<span class="kw">import</span> { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Entity</span>({ name: <span class="str">'products'</span> })
<span class="kw">export class</span> <span class="tp">Product</span> {

  <span class="dec">@PrimaryGeneratedColumn</span>(<span class="str">'uuid'</span>)
  id: <span class="tp">string</span>;

  <span class="dec">@Column</span>(<span class="str">'text'</span>, { unique: <span class="kw">true</span> })
  title: <span class="tp">string</span>;

  <span class="dec">@Column</span>(<span class="str">'float'</span>, { default: <span class="num">0</span> })
  price: <span class="tp">number</span>;

  <span class="dec">@Column</span>({ type: <span class="str">'text'</span>, nullable: <span class="kw">true</span> })
  description: <span class="tp">string</span>;

  <span class="dec">@Column</span>(<span class="str">'text'</span>, { unique: <span class="kw">true</span> })
  slug: <span class="tp">string</span>;

  <span class="dec">@Column</span>(<span class="str">'int'</span>, { default: <span class="num">0</span> })
  stock: <span class="tp">number</span>;

  <span class="dec">@Column</span>(<span class="str">'text'</span>, { array: <span class="kw">true</span> })
  sizes: <span class="tp">string</span>[];

  <span class="dec">@Column</span>(<span class="str">'text'</span>, { array: <span class="kw">true</span>, default: [] })
  tags: <span class="tp">string</span>[];

  <span class="dec">@BeforeInsert</span>()
  <span class="fn">checkSlugInsert</span>() {
    <span class="kw">if</span> (!<span class="kw">this</span>.slug)
      <span class="kw">this</span>.slug = <span class="kw">this</span>.title;
    <span class="kw">this</span>.slug = <span class="kw">this</span>.slug
      .<span class="fn">toLowerCase</span>().<span class="fn">replaceAll</span>(<span class="str">' '</span>, <span class="str">'_'</span>).<span class="fn">replaceAll</span>(<span class="str">"'"</span>, <span class="str">''</span>);
  }
}`
      }
    },
    {
      heading: "Insertar, buscar y eliminar con Repository",
      body: `
<p>TypeORM inyecta el Repository de cada entidad con <code>@InjectRepository()</code>. Tienes métodos para todas las operaciones CRUD sin escribir SQL.</p>
      `,
      code: {
        lang: "typescript",
        label: "products.service.ts — CRUD con Repository",
        content: `<span class="kw">import</span> { InjectRepository } <span class="kw">from</span> <span class="str">'@nestjs/typeorm'</span>;
<span class="kw">import</span> { Repository } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">ProductsService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@InjectRepository</span>(Product)
    <span class="kw">private readonly</span> productRepository: <span class="tp">Repository</span>&lt;<span class="tp">Product</span>&gt;,
  ) {}

  <span class="kw">async</span> <span class="fn">create</span>(dto: <span class="tp">CreateProductDto</span>) {
    <span class="kw">const</span> product = <span class="kw">this</span>.productRepository.<span class="fn">create</span>(dto); <span class="cm">// instancia en memoria</span>
    <span class="kw">return await this</span>.productRepository.<span class="fn">save</span>(product);  <span class="cm">// persiste en BD</span>
  }

  <span class="kw">async</span> <span class="fn">findAll</span>({ limit = <span class="num">10</span>, offset = <span class="num">0</span> }: <span class="tp">PaginationDto</span>) {
    <span class="kw">return this</span>.productRepository.<span class="fn">find</span>({
      take: limit,
      skip: offset,
    });
  }

  <span class="kw">async</span> <span class="fn">remove</span>(id: <span class="tp">string</span>) {
    <span class="kw">const</span> product = <span class="kw">await this</span>.<span class="fn">findOne</span>(id);
    <span class="kw">await this</span>.productRepository.<span class="fn">remove</span>(product);
  }
}`
      },
      quiz: {
        q: "¿Cuál es la diferencia entre productRepository.create() y productRepository.save()?",
        options: [
          "create() guarda en BD, save() crea en memoria",
          "create() crea la instancia en memoria sin ir a la BD; save() persiste en la BD",
          "Ambos hacen lo mismo, es solo semántica",
          "create() es más lento porque valida primero"
        ],
        correct: 1,
        feedback: "create() instancia la entity con los datos del DTO en memoria (ejecuta @BeforeInsert si hay). save() es quien hace el INSERT/UPDATE real en la BD. Siempre necesitas ambos para crear."
      }
    },
    {
      heading: "QueryBuilder — Buscar por Slug o UUID",
      body: `
<p>TypeORM permite buscar con <code>findOne</code> simple o con <code>QueryBuilder</code> para queries más complejas. Para buscar por slug o UUID con un solo endpoint, QueryBuilder es más flexible.</p>
      `,
      code: {
        lang: "typescript",
        label: "findOne — buscar por UUID o slug",
        content: `<span class="kw">import</span> { isUUID } <span class="kw">from</span> <span class="str">'class-validator'</span>;

<span class="kw">async</span> <span class="fn">findOne</span>(term: <span class="tp">string</span>): <span class="tp">Promise</span>&lt;<span class="tp">Product</span>&gt; {
  <span class="kw">let</span> product: <span class="tp">Product</span>;

  <span class="kw">if</span> (<span class="fn">isUUID</span>(term)) {
    product = <span class="kw">await this</span>.productRepository.<span class="fn">findOneBy</span>({ id: term });
  } <span class="kw">else</span> {
    <span class="kw">const</span> queryBuilder = <span class="kw">this</span>.productRepository.<span class="fn">createQueryBuilder</span>(<span class="str">'prod'</span>);
    product = <span class="kw">await</span> queryBuilder
      .<span class="fn">where</span>(<span class="str">'UPPER(prod.title) = :title OR prod.slug = :slug'</span>, {
        title: term.<span class="fn">toUpperCase</span>(),
        slug: term.<span class="fn">toLowerCase</span>(),
      })
      .<span class="fn">getOne</span>();
  }

  <span class="kw">if</span> (!product) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Product "\${term}" not found\`</span>);
  <span class="kw">return</span> product;
}`
      }
    },
    {
      heading: "Manejo de errores de base de datos",
      body: `
<p>Cuando TypeORM lanza un error de constraint (clave duplicada, violación de FK), NestJS no lo atrapa automáticamente — obtienes un 500. Debes capturar y convertir a una HttpException apropiada.</p>
      `,
      code: {
        lang: "typescript",
        label: "handleDbErrors — capturar errores de TypeORM",
        content: `<span class="kw">import</span> { Logger, InternalServerErrorException } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="kw">private readonly</span> logger = <span class="kw">new</span> <span class="fn">Logger</span>(<span class="str">'ProductsService'</span>);

<span class="kw">private</span> <span class="fn">handleDbErrors</span>(error: <span class="kw">any</span>): <span class="kw">never</span> {
  <span class="kw">if</span> (error.code === <span class="str">'23505'</span>) {
    <span class="cm">// PostgreSQL: unique constraint violation</span>
    <span class="kw">throw new</span> <span class="fn">BadRequestException</span>(error.detail);
  }
  <span class="kw">this</span>.logger.<span class="fn">error</span>(error);
  <span class="kw">throw new</span> <span class="fn">InternalServerErrorException</span>(<span class="str">'Unexpected error — check server logs'</span>);
}

<span class="cm">// En create():</span>
<span class="kw">try</span> {
  <span class="kw">const</span> product = <span class="kw">this</span>.productRepository.<span class="fn">create</span>(dto);
  <span class="kw">return await this</span>.productRepository.<span class="fn">save</span>(product);
} <span class="kw">catch</span> (error) {
  <span class="kw">this</span>.<span class="fn">handleDbErrors</span>(error);
}`
      },
      callout: { title: "Error code 23505", text: "El código 23505 es el código de PostgreSQL para 'unique_violation'. Cada BD tiene sus propios códigos de error. En producción loguea siempre los errores inesperados — el cliente no necesita los detalles internos, pero tú sí." }
    }
  ]
};
