export default {
  title: "MongoDB Pokedex",
  desc: "Nuevo proyecto: Pokedex API con MongoDB. Aprende a conectar NestJS con Mongo usando Mongoose, definir schemas, y hacer CRUD real contra base de datos.",
  lectures: [
    {
      heading: "Inicio de proyecto Pokedex y Global Prefix",
      body: `
<p>Creas un nuevo proyecto NestJS: <strong>Pokedex</strong>. Una API para consultar y gestionar información de Pokémon.</p>
<p><strong>Global Prefix</strong>: un prefijo que se agrega a todas las rutas de la app. Por ejemplo, con <code>/api</code> como prefix, la ruta <code>/pokemon</code> queda como <code>/api/pokemon</code>.</p>
      `,
      code: {
        lang: "bash",
        label: "Crear proyecto Pokedex",
        content: `nest new pokedex
cd pokedex
npm run start:dev`
      },
      code2: {
        lang: "typescript",
        label: "main.ts — Global Prefix + contenido estático",
        content: `<span class="kw">import</span> { NestFactory } <span class="kw">from</span> <span class="str">'@nestjs/core'</span>;
<span class="kw">import</span> { NestExpressApplication } <span class="kw">from</span> <span class="str">'@nestjs/platform-express'</span>;
<span class="kw">import</span> { join } <span class="kw">from</span> <span class="str">'path'</span>;

<span class="kw">async function</span> <span class="fn">bootstrap</span>() {
  <span class="kw">const</span> app = <span class="kw">await</span> NestFactory.<span class="fn">create</span>&lt;<span class="tp">NestExpressApplication</span>&gt;(AppModule);

  <span class="cm">// Servir archivos estáticos desde public/</span>
  app.<span class="fn">useStaticAssets</span>(<span class="fn">join</span>(__dirname, <span class="str">'..'</span>, <span class="str">'public'</span>));

  <span class="cm">// Todas las rutas tendrán el prefijo /api</span>
  app.<span class="fn">setGlobalPrefix</span>(<span class="str">'api'</span>);

  <span class="kw">await</span> app.<span class="fn">listen</span>(<span class="num">3000</span>);
}
<span class="fn">bootstrap</span>();
<span class="cm">// GET /api/pokemon → listado de Pokémon</span>`
      }
    },
    {
      heading: "Docker + Docker Compose + MongoDB",
      body: `
<p>En vez de instalar MongoDB localmente, usas Docker. <code>docker-compose.yml</code> define el contenedor de MongoDB — lo arrancas con un comando y tienes la BD lista.</p>
      `,
      code: {
        lang: "yaml",
        label: "docker-compose.yml — MongoDB en contenedor",
        content: `version: '3'
services:
  db:
    image: mongo:6
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGODB_DATABASE: nest-pokemon
    volumes:
      - ./mongo:/data/db`
      },
      code2: {
        lang: "bash",
        label: "Comandos Docker",
        content: `<span class="cm"># Arrancar MongoDB en background</span>
docker-compose up -d

<span class="cm"># Ver logs</span>
docker-compose logs -f

<span class="cm"># Detener</span>
docker-compose down

<span class="cm"># MongoDB disponible en:</span>
<span class="cm"># mongodb://localhost:27017/nest-pokemon</span>`
      }
    },
    {
      heading: "Conectar NestJS con MongoDB (Mongoose)",
      body: `
<p>NestJS tiene integración oficial con Mongoose a través de <code>@nestjs/mongoose</code>. Se configura en el módulo raíz con la URL de conexión.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar Mongoose",
        content: `npm install @nestjs/mongoose mongoose`
      },
      code2: {
        lang: "typescript",
        label: "app.module.ts — conectar con MongoDB",
        content: `<span class="kw">import</span> { MongooseModule } <span class="kw">from</span> <span class="str">'@nestjs/mongoose'</span>;

<span class="dec">@Module</span>({
  imports: [
    <span class="fn">MongooseModule</span>.<span class="fn">forRoot</span>(<span class="str">'mongodb://localhost:27017/nest-pokemon'</span>),
    PokemonModule,
  ],
})
<span class="kw">export class</span> <span class="tp">AppModule</span> {}`
      }
    },
    {
      heading: "Schemas, Modelos y POST a la BD",
      body: `
<p>En Mongoose, un <strong>Schema</strong> define la estructura de un documento. NestJS usa decoradores para definirlo. El <strong>Model</strong> es lo que usas para hacer operaciones en la colección.</p>
      `,
      code: {
        lang: "typescript",
        label: "entities/pokemon.entity.ts — Schema de Mongoose",
        content: `<span class="kw">import</span> { Prop, Schema, SchemaFactory } <span class="kw">from</span> <span class="str">'@nestjs/mongoose'</span>;
<span class="kw">import</span> { Document } <span class="kw">from</span> <span class="str">'mongoose'</span>;

<span class="dec">@Schema</span>()
<span class="kw">export class</span> <span class="tp">Pokemon</span> <span class="kw">extends</span> <span class="tp">Document</span> {
  <span class="cm">// id: string ← Mongo lo genera automáticamente como _id</span>

  <span class="dec">@Prop</span>({ unique: <span class="kw">true</span>, index: <span class="kw">true</span> })
  name: <span class="tp">string</span>;

  <span class="dec">@Prop</span>({ unique: <span class="kw">true</span> })
  no: <span class="tp">number</span>;
}

<span class="kw">export const</span> PokemonSchema = SchemaFactory.<span class="fn">createForClass</span>(Pokemon);`
      },
      code2: {
        lang: "typescript",
        label: "pokemon.service.ts — crear Pokémon en la BD",
        content: `<span class="kw">import</span> { InjectModel } <span class="kw">from</span> <span class="str">'@nestjs/mongoose'</span>;
<span class="kw">import</span> { Model } <span class="kw">from</span> <span class="str">'mongoose'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">PokemonService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@InjectModel</span>(Pokemon.name)
    <span class="kw">private readonly</span> pokemonModel: <span class="tp">Model</span>&lt;<span class="tp">Pokemon</span>&gt;
  ) {}

  <span class="kw">async</span> <span class="fn">create</span>(createPokemonDto: <span class="tp">CreatePokemonDto</span>) {
    <span class="kw">const</span> pokemon = <span class="kw">await this</span>.pokemonModel.<span class="fn">create</span>({
      ...createPokemonDto,
      name: createPokemonDto.name.<span class="fn">toLowerCase</span>(),
    });
    <span class="kw">return</span> pokemon;
  }
}`
      },
      quiz: {
        q: "¿Cuál es la diferencia entre pokemonModel.create() en Mongoose vs repo.create() en TypeORM?",
        options: [
          "No hay diferencia, ambos hacen lo mismo",
          "En Mongoose, create() guarda directamente en la BD; en TypeORM, create() solo crea la instancia en memoria",
          "En TypeORM, create() guarda en la BD; en Mongoose solo crea el objeto",
          "Ambos requieren llamar a save() después"
        ],
        correct: 1,
        feedback: "Diferencia importante: Model.create() de Mongoose crea Y guarda en la BD en un solo paso. TypeORM separa: repo.create() para instancia en memoria, luego repo.save() para persistir."
      }
    },
    {
      heading: "FindOne, Update y Delete en MongoDB",
      body: `
<p>Mongoose permite buscar por múltiples campos. Para Pokémon puedes buscar por <code>id</code> de MongoDB, por <code>no</code> (número), o por <code>name</code>. El servicio detecta el formato y usa el query correcto.</p>
      `,
      code: {
        lang: "typescript",
        label: "findOne — buscar por id, no, o name",
        content: `<span class="kw">import</span> { isValidObjectId } <span class="kw">from</span> <span class="str">'mongoose'</span>;

<span class="kw">async</span> <span class="fn">findOne</span>(term: <span class="tp">string</span>): <span class="tp">Promise</span>&lt;<span class="tp">Pokemon</span>&gt; {
  <span class="kw">let</span> pokemon: <span class="tp">Pokemon</span>;

  <span class="cm">// Buscar por número de Pokédex</span>
  <span class="kw">if</span> (!<span class="fn">isNaN</span>(+term)) {
    pokemon = <span class="kw">await this</span>.pokemonModel.<span class="fn">findOne</span>({ no: +term });
  }

  <span class="cm">// Buscar por MongoID</span>
  <span class="kw">if</span> (!pokemon && <span class="fn">isValidObjectId</span>(term)) {
    pokemon = <span class="kw">await this</span>.pokemonModel.<span class="fn">findById</span>(term);
  }

  <span class="cm">// Buscar por nombre</span>
  <span class="kw">if</span> (!pokemon) {
    pokemon = <span class="kw">await this</span>.pokemonModel.<span class="fn">findOne</span>({ name: term.<span class="fn">toLowerCase</span>() });
  }

  <span class="kw">if</span> (!pokemon) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Pokemon "\${term}" not found\`</span>);
  <span class="kw">return</span> pokemon;
}`
      },
      code2: {
        lang: "typescript",
        label: "update() y remove() con Mongoose",
        content: `<span class="kw">async</span> <span class="fn">update</span>(term: <span class="tp">string</span>, dto: <span class="tp">UpdatePokemonDto</span>) {
  <span class="kw">const</span> pokemon = <span class="kw">await this</span>.<span class="fn">findOne</span>(term);

  <span class="kw">if</span> (dto.name) dto.name = dto.name.<span class="fn">toLowerCase</span>();

  <span class="kw">await</span> pokemon.<span class="fn">updateOne</span>(dto);
  <span class="kw">return</span> { ...pokemon.<span class="fn">toJSON</span>(), ...dto };
}

<span class="kw">async</span> <span class="fn">remove</span>(id: <span class="tp">string</span>) {
  <span class="cm">// findByIdAndDelete valida que el id sea ObjectId válido</span>
  <span class="kw">const</span> { deletedCount } = <span class="kw">await this</span>.pokemonModel.<span class="fn">deleteOne</span>({ _id: id });
  <span class="kw">if</span> (deletedCount === <span class="num">0</span>)
    <span class="kw">throw new</span> <span class="fn">BadRequestException</span>(<span class="str">\`Pokemon with id "\${id}" not found\`</span>);
}`
      }
    }
  ]
};
