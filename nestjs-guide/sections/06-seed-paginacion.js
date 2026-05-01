export default {
  title: "Seed y Paginación",
  desc: "Carga masiva de datos desde la PokeAPI usando Axios desde NestJS, paginación con DTOs de query, y custom providers opcionales.",
  lectures: [
    {
      heading: "Módulo SEED y peticiones HTTP con Axios",
      body: `
<p>El SEED de Pokedex carga los 151 Pokémon originales desde la PokeAPI. NestJS tiene <code>@nestjs/axios</code> para hacer peticiones HTTP desde el servidor.</p>
      `,
      code: {
        lang: "bash",
        label: "Instalar Axios para NestJS",
        content: `npm install @nestjs/axios axios`
      },
      code2: {
        lang: "typescript",
        label: "seed.service.ts — request a PokeAPI",
        content: `<span class="kw">import</span> { HttpService } <span class="kw">from</span> <span class="str">'@nestjs/axios'</span>;
<span class="kw">import</span> { firstValueFrom } <span class="kw">from</span> <span class="str">'rxjs'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">SeedService</span> {
  <span class="kw">constructor</span>(<span class="kw">private readonly</span> http: <span class="tp">HttpService</span>) {}

  <span class="kw">async</span> <span class="fn">executeSeed</span>() {
    <span class="kw">const</span> { data } = <span class="kw">await</span> <span class="fn">firstValueFrom</span>(
      <span class="kw">this</span>.http.<span class="fn">get</span>&lt;<span class="tp">PokeResponse</span>&gt;(<span class="str">'https://pokeapi.co/api/v2/pokemon?limit=151'</span>)
    );

    <span class="kw">const</span> insertPromises = data.results.<span class="fn">map</span>(({ name, url }) => {
      <span class="kw">const</span> no = +url.<span class="fn">split</span>(<span class="str">'/'</span>).<span class="fn">at</span>(-<span class="num">2</span>);
      <span class="kw">return this</span>.pokemonModel.<span class="fn">findOneAndUpdate</span>(
        { no },
        { name, no },
        { upsert: <span class="kw">true</span> }
      );
    });

    <span class="kw">await</span> Promise.<span class="fn">all</span>(insertPromises);
    <span class="kw">return</span> <span class="str">'Seed ejecutado'</span>;
  }
}`
      },
      callout: { title: "firstValueFrom vs subscribe", text: "HttpService devuelve Observables (RxJS). firstValueFrom los convierte a Promises para poder usar await. Es la forma recomendada en NestJS para código async/await." }
    },
    {
      heading: "Insertar múltiples registros simultáneamente",
      body: `
<p>Insertar los 151 Pokémon uno por uno sería lento. <code>Promise.all</code> paraleliza las inserciones. Para inserciones masivas puras, Mongoose también tiene <code>insertMany()</code>.</p>
      `,
      code: {
        lang: "typescript",
        label: "Inserción masiva con insertMany",
        content: `<span class="kw">async</span> <span class="fn">executeSeed</span>() {
  <span class="cm">// Limpiar colección primero</span>
  <span class="kw">await this</span>.pokemonModel.<span class="fn">deleteMany</span>({});

  <span class="kw">const</span> { data } = <span class="kw">await</span> <span class="fn">firstValueFrom</span>(
    <span class="kw">this</span>.http.<span class="fn">get</span>&lt;<span class="tp">PokeResponse</span>&gt;(<span class="str">'https://pokeapi.co/api/v2/pokemon?limit=151'</span>)
  );

  <span class="kw">const</span> pokemonToInsert = data.results.<span class="fn">map</span>(({ name, url }) => ({
    name,
    no: +url.<span class="fn">split</span>(<span class="str">'/'</span>).<span class="fn">at</span>(-<span class="num">2</span>),
  }));

  <span class="cm">// Una sola operación masiva — mucho más rápido</span>
  <span class="kw">await this</span>.pokemonModel.<span class="fn">insertMany</span>(pokemonToInsert);
  <span class="kw">return</span> <span class="str">\`\${pokemonToInsert.length} pokémon insertados\`</span>;
}`
      }
    },
    {
      heading: "Paginación de Pokémon",
      body: `
<p>La paginación permite devolver los datos en páginas. Los parámetros <code>limit</code> y <code>offset</code> vienen en la query string: <code>/pokemon?limit=10&offset=20</code>.</p>
<p>Se usan <strong>Query DTOs</strong> con <code>@Query()</code> para tipar y validar los parámetros de consulta.</p>
      `,
      code: {
        lang: "typescript",
        label: "dto/pagination.dto.ts + findAll con paginación",
        content: `<span class="kw">import</span> { IsOptional, IsPositive, Min } <span class="kw">from</span> <span class="str">'class-validator'</span>;
<span class="kw">import</span> { Type } <span class="kw">from</span> <span class="str">'class-transformer'</span>;

<span class="kw">export class</span> <span class="tp">PaginationDto</span> {
  <span class="dec">@IsOptional</span>()
  <span class="dec">@IsPositive</span>()
  <span class="dec">@Type</span>(() => Number) <span class="cm">// convierte query string a number</span>
  limit?: <span class="tp">number</span>;

  <span class="dec">@IsOptional</span>()
  <span class="dec">@Min</span>(<span class="num">0</span>)
  <span class="dec">@Type</span>(() => Number)
  offset?: <span class="tp">number</span>;
}

<span class="cm">// pokemon.controller.ts</span>
<span class="dec">@Get</span>()
<span class="fn">findAll</span>(<span class="dec">@Query</span>() paginationDto: <span class="tp">PaginationDto</span>) {
  <span class="kw">return this</span>.pokemonService.<span class="fn">findAll</span>(paginationDto);
}

<span class="cm">// pokemon.service.ts</span>
<span class="kw">async</span> <span class="fn">findAll</span>({ limit = <span class="num">10</span>, offset = <span class="num">0</span> }: <span class="tp">PaginationDto</span>) {
  <span class="kw">return this</span>.pokemonModel
    .<span class="fn">find</span>()
    .<span class="fn">limit</span>(limit)
    .<span class="fn">skip</span>(offset)
    .<span class="fn">select</span>(<span class="str">'-__v'</span>);  <span class="cm">// excluir campo __v de Mongoose</span>
}`
      },
      quiz: {
        q: "¿Por qué se usa @Type(() => Number) en el PaginationDto?",
        options: [
          "Para convertir el número a string en la respuesta",
          "Porque los parámetros de query llegan como string y @Type() convierte a number",
          "Es un requisito de Mongoose para queries",
          "Para que @IsPositive() funcione correctamente"
        ],
        correct: 1,
        feedback: "Los query params de HTTP siempre llegan como strings ('10', '0'). @Type(() => Number) con transform: true en ValidationPipe convierte '10' a 10 antes de validar. Sin esto, @IsPositive() fallaría porque recibe un string."
      }
    },
    {
      heading: "Transform DTOs — Valores por defecto",
      body: `
<p><code>DefaultValuePipe</code> establece valores por defecto para parámetros opcionales. Alternativa a definirlo en la desestructuración del servicio.</p>
      `,
      code: {
        lang: "typescript",
        label: "DefaultValuePipe en el controlador",
        content: `<span class="kw">import</span> { Query, DefaultValuePipe, ParseIntPipe } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Get</span>()
<span class="fn">findAll</span>(
  <span class="dec">@Query</span>(<span class="str">'limit'</span>, <span class="kw">new</span> <span class="fn">DefaultValuePipe</span>(<span class="num">10</span>), ParseIntPipe) limit: <span class="tp">number</span>,
  <span class="dec">@Query</span>(<span class="str">'offset'</span>, <span class="kw">new</span> <span class="fn">DefaultValuePipe</span>(<span class="num">0</span>), ParseIntPipe) offset: <span class="tp">number</span>,
) {
  <span class="cm">// GET /pokemon         → limit=10, offset=0</span>
  <span class="cm">// GET /pokemon?limit=5 → limit=5, offset=0</span>
  <span class="kw">return this</span>.pokemonService.<span class="fn">findAll</span>({ limit, offset });
}`
      },
      callout: { title: "DTO vs Pipes individuales", text: "Usar un PaginationDto es más limpio cuando tienes muchos parámetros relacionados. Usar DefaultValuePipe y ParseIntPipe directamente en el decorador es más explícito para 1-2 parámetros simples. Elige el que sea más legible para tu caso." }
    }
  ]
};
