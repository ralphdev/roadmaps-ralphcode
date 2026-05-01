export default {
  title: "Nest CLI Resource — Brands CRUD",
  desc: "Genera un CRUD completo con un solo comando, crea el SEED para poblar datos y aprende a inyectar servicios entre módulos distintos.",
  lectures: [
    {
      heading: "Nest CLI Resource — Brands",
      body: `
<p>El comando <code>nest generate resource</code> genera el CRUD completo de un recurso en un solo paso: módulo, controlador, servicio, DTOs y tests.</p>
<p>Para CarDealership, agregarás <strong>Brands</strong> (marcas de carros) como recurso independiente.</p>
      `,
      code: {
        lang: "bash",
        label: "Generar CRUD completo de Brands",
        content: `<span class="cm"># Genera módulo, controlador, servicio, DTOs y tests de una vez</span>
nest generate resource brands
<span class="cm"># shorthand: nest g res brands</span>

<span class="cm"># El CLI pregunta:</span>
<span class="cm"># ? What transport layer do you use? → REST API</span>
<span class="cm"># ? Would you like to generate CRUD entry points? → Yes</span>

<span class="cm"># Genera en src/brands/:</span>
<span class="cm">#   brands.module.ts</span>
<span class="cm">#   brands.controller.ts  (GET, GET/:id, POST, PATCH/:id, DELETE/:id)</span>
<span class="cm">#   brands.service.ts</span>
<span class="cm">#   dto/create-brand.dto.ts</span>
<span class="cm">#   dto/update-brand.dto.ts</span>
<span class="cm">#   entities/brand.entity.ts</span>`
      },
      code2: {
        lang: "typescript",
        label: "brands/entities/brand.entity.ts — definir la entidad",
        content: `<span class="kw">export class</span> <span class="tp">Brand</span> {
  id: <span class="tp">string</span>;
  name: <span class="tp">string</span>;
  createdAt: <span class="tp">Date</span>;
}

<span class="cm">// brands/dto/create-brand.dto.ts</span>
<span class="kw">import</span> { IsString, MinLength } <span class="kw">from</span> <span class="str">'class-validator'</span>;

<span class="kw">export class</span> <span class="tp">CreateBrandDto</span> {
  <span class="dec">@IsString</span>()
  <span class="dec">@MinLength</span>(<span class="num">1</span>)
  name: <span class="tp">string</span>;
}`
      }
    },
    {
      heading: "CRUD completo de Brands",
      body: `
<p>Implementa el servicio de Brands con todos los métodos CRUD. El patrón es idéntico a CarsService — la diferencia es que Brands tiene un campo <code>createdAt</code> y el nombre como identificador alternativo.</p>
      `,
      code: {
        lang: "typescript",
        label: "brands.service.ts — CRUD completo",
        content: `<span class="kw">import</span> { Injectable, NotFoundException } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { v4 <span class="kw">as</span> uuid } <span class="kw">from</span> <span class="str">'uuid'</span>;
<span class="kw">import</span> { CreateBrandDto } <span class="kw">from</span> <span class="str">'./dto/create-brand.dto'</span>;
<span class="kw">import</span> { UpdateBrandDto } <span class="kw">from</span> <span class="str">'./dto/update-brand.dto'</span>;
<span class="kw">import</span> { Brand } <span class="kw">from</span> <span class="str">'./entities/brand.entity'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">BrandsService</span> {
  <span class="kw">private</span> brands: <span class="tp">Brand</span>[] = [];

  <span class="fn">create</span>(createBrandDto: <span class="tp">CreateBrandDto</span>): <span class="tp">Brand</span> {
    <span class="kw">const</span> brand: <span class="tp">Brand</span> = {
      id: <span class="fn">uuid</span>(),
      createdAt: <span class="kw">new</span> Date(),
      ...createBrandDto,
    };
    <span class="kw">this</span>.brands.<span class="fn">push</span>(brand);
    <span class="kw">return</span> brand;
  }

  <span class="fn">findAll</span>(): <span class="tp">Brand</span>[] { <span class="kw">return this</span>.brands; }

  <span class="fn">findOne</span>(id: <span class="tp">string</span>): <span class="tp">Brand</span> {
    <span class="kw">const</span> brand = <span class="kw">this</span>.brands.<span class="fn">find</span>(b => b.id === id);
    <span class="kw">if</span> (!brand) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Brand #\${id} not found\`</span>);
    <span class="kw">return</span> brand;
  }

  <span class="fn">update</span>(id: <span class="tp">string</span>, dto: <span class="tp">UpdateBrandDto</span>): <span class="tp">Brand</span> {
    <span class="kw">this</span>.<span class="fn">findOne</span>(id); <span class="cm">// valida que existe</span>
    <span class="kw">this</span>.brands = <span class="kw">this</span>.brands.<span class="fn">map</span>(b =>
      b.id === id ? { ...b, ...dto } : b
    );
    <span class="kw">return this</span>.<span class="fn">findOne</span>(id);
  }

  <span class="fn">remove</span>(id: <span class="tp">string</span>): <span class="tp">void</span> {
    <span class="kw">this</span>.<span class="fn">findOne</span>(id);
    <span class="kw">this</span>.brands = <span class="kw">this</span>.brands.<span class="fn">filter</span>(b => b.id !== id);
  }
}`
      }
    },
    {
      heading: "Servicio SEED para cargar datos",
      body: `
<p>Un SEED es un proceso que carga datos iniciales en la app. En NestJS se implementa como un endpoint especial (generalmente <code>GET /seed</code>) que reinicializa los datos con registros de prueba.</p>
<p>El módulo SEED necesita acceder a los servicios de Cars y Brands. Para eso, los módulos deben <strong>exportar</strong> sus servicios.</p>
      `,
      code: {
        lang: "bash",
        label: "Generar módulo SEED",
        content: `nest generate module seed
nest generate controller seed
nest generate service seed`
      },
      code2: {
        lang: "typescript",
        label: "seed.service.ts — poblar datos iniciales",
        content: `<span class="kw">import</span> { Injectable } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { CarsService } <span class="kw">from</span> <span class="str">'../cars/cars.service'</span>;
<span class="kw">import</span> { BrandsService } <span class="kw">from</span> <span class="str">'../brands/brands.service'</span>;

<span class="kw">const</span> CARS_SEED = [
  { brand: <span class="str">'Toyota'</span>, model: <span class="str">'Corolla'</span>   },
  { brand: <span class="str">'Honda'</span>,  model: <span class="str">'Civic'</span>     },
  { brand: <span class="str">'Ford'</span>,   model: <span class="str">'Mustang'</span>   },
];

<span class="kw">const</span> BRANDS_SEED = [
  { name: <span class="str">'Toyota'</span> },
  { name: <span class="str">'Honda'</span>  },
  { name: <span class="str">'Ford'</span>   },
];

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">SeedService</span> {
  <span class="kw">constructor</span>(
    <span class="kw">private readonly</span> carsService: <span class="tp">CarsService</span>,
    <span class="kw">private readonly</span> brandsService: <span class="tp">BrandsService</span>,
  ) {}

  <span class="fn">runSeed</span>() {
    <span class="kw">this</span>.carsService.<span class="fn">fillCarsWithSeedData</span>(CARS_SEED);
    <span class="kw">this</span>.brandsService.<span class="fn">fillBrandsWithSeedData</span>(BRANDS_SEED);
    <span class="kw">return</span> <span class="str">'SEED ejecutado'</span>;
  }
}`
      }
    },
    {
      heading: "Inyectar servicios entre módulos",
      body: `
<p>Para que SeedService pueda usar CarsService y BrandsService, esos módulos deben <strong>exportar</strong> sus servicios. SeedModule los <strong>importa</strong>. Sin estas dos cosas, NestJS no puede inyectarlos.</p>
      `,
      code: {
        lang: "typescript",
        label: "cars.module.ts — exportar el servicio",
        content: `<span class="dec">@Module</span>({
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],  <span class="cm">// ← necesario para que otros módulos lo usen</span>
})
<span class="kw">export class</span> <span class="tp">CarsModule</span> {}`
      },
      code2: {
        lang: "typescript",
        label: "seed.module.ts — importar los módulos que necesita",
        content: `<span class="kw">import</span> { Module } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { CarsModule } <span class="kw">from</span> <span class="str">'../cars/cars.module'</span>;
<span class="kw">import</span> { BrandsModule } <span class="kw">from</span> <span class="str">'../brands/brands.module'</span>;

<span class="dec">@Module</span>({
  imports: [CarsModule, BrandsModule],  <span class="cm">// ← importa los módulos, no los servicios</span>
  controllers: [SeedController],
  providers: [SeedService],
})
<span class="kw">export class</span> <span class="tp">SeedModule</span> {}`
      },
      callout: { title: "Módulo vs Servicio en imports", text: "En 'imports' del módulo siempre pones el MÓDULO (CarsModule), no el servicio (CarsService). NestJS sabe qué servicios ofrece ese módulo por lo que tiene en 'exports'." },
      quiz: {
        q: "SeedService necesita CarsService. ¿Qué debes hacer para que NestJS pueda inyectarlo?",
        options: [
          "Importar CarsService directamente en providers de SeedModule",
          "Exportar CarsService desde CarsModule e importar CarsModule en SeedModule",
          "Agregar @Injectable() a CarsService y listo",
          "Crear CarsService manualmente con new en SeedService"
        ],
        correct: 1,
        feedback: "Dos pasos: 1) CarsModule exporta CarsService en su array 'exports'. 2) SeedModule importa CarsModule en su array 'imports'. NestJS conecta el resto automáticamente."
      }
    }
  ]
};
