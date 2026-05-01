export default {
  title: "Relaciones en TypeORM",
  desc: "OneToMany, ManyToOne, transacciones con QueryRunner, eliminación en cascada y SEED masivo con imágenes de productos.",
  lectures: [
    {
      heading: "ProductImage Entity — OneToMany / ManyToOne",
      body: `
<p>Un producto puede tener varias imágenes. Eso es una relación <strong>One-to-Many</strong> (uno a muchos). TypeORM la define con decoradores en ambas entidades.</p>
<ul>
  <li><code>@OneToMany</code> en Product → "un producto tiene muchas imágenes"</li>
  <li><code>@ManyToOne</code> en ProductImage → "una imagen pertenece a un producto"</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "product-image.entity.ts + relación en product.entity.ts",
        content: `<span class="cm">// product-image.entity.ts</span>
<span class="kw">import</span> { Entity, PrimaryGeneratedColumn, Column, ManyToOne } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Entity</span>({ name: <span class="str">'product_images'</span> })
<span class="kw">export class</span> <span class="tp">ProductImage</span> {
  <span class="dec">@PrimaryGeneratedColumn</span>()
  id: <span class="tp">number</span>;

  <span class="dec">@Column</span>(<span class="str">'text'</span>)
  url: <span class="tp">string</span>;

  <span class="dec">@ManyToOne</span>(() => Product, product => product.images, { onDelete: <span class="str">'CASCADE'</span> })
  product: <span class="tp">Product</span>;
}

<span class="cm">// product.entity.ts — agregar la relación</span>
<span class="kw">import</span> { OneToMany } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Entity</span>()
<span class="kw">export class</span> <span class="tp">Product</span> {
  <span class="cm">// ... otras columnas ...</span>

  <span class="dec">@OneToMany</span>(() => ProductImage, image => image.product, { cascade: <span class="kw">true</span> })
  images: <span class="tp">ProductImage</span>[];
}`
      }
    },
    {
      heading: "Crear producto con imágenes — transacciones con QueryRunner",
      body: `
<p>Cuando creas un producto con sus imágenes, ambas operaciones deben ser <strong>atómicas</strong>: si falla una, se revierten todas. Eso es una <strong>transacción</strong>.</p>
<p><code>QueryRunner</code> es la forma de TypeORM para gestionar transacciones manualmente — tienes control total sobre cuándo hacer commit o rollback.</p>
      `,
      code: {
        lang: "typescript",
        label: "products.service.ts — transacción con QueryRunner",
        content: `<span class="kw">import</span> { DataSource } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">ProductsService</span> {
  <span class="kw">constructor</span>(
    <span class="dec">@InjectRepository</span>(Product)
    <span class="kw">private readonly</span> productRepository: <span class="tp">Repository</span>&lt;<span class="tp">Product</span>&gt;,
    <span class="kw">private readonly</span> dataSource: <span class="tp">DataSource</span>,
  ) {}

  <span class="kw">async</span> <span class="fn">update</span>(id: <span class="tp">string</span>, dto: <span class="tp">UpdateProductDto</span>) {
    <span class="kw">const</span> { images = [], ...toUpdate } = dto;

    <span class="kw">const</span> product = <span class="kw">await this</span>.productRepository.<span class="fn">preload</span>({ id, ...toUpdate });
    <span class="kw">if</span> (!product) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(<span class="str">\`Product \${id} not found\`</span>);

    <span class="kw">const</span> queryRunner = <span class="kw">this</span>.dataSource.<span class="fn">createQueryRunner</span>();
    <span class="kw">await</span> queryRunner.<span class="fn">connect</span>();
    <span class="kw">await</span> queryRunner.<span class="fn">startTransaction</span>();

    <span class="kw">try</span> {
      <span class="cm">// Eliminar imágenes anteriores</span>
      <span class="kw">await</span> queryRunner.manager.<span class="fn">delete</span>(ProductImage, { product: { id } });

      <span class="cm">// Asignar nuevas imágenes</span>
      product.images = images.<span class="fn">map</span>(url =>
        queryRunner.manager.<span class="fn">create</span>(ProductImage, { url })
      );

      <span class="kw">await</span> queryRunner.manager.<span class="fn">save</span>(product);
      <span class="kw">await</span> queryRunner.<span class="fn">commitTransaction</span>();
      <span class="kw">return this</span>.<span class="fn">findOne</span>(id);

    } <span class="kw">catch</span> (error) {
      <span class="kw">await</span> queryRunner.<span class="fn">rollbackTransaction</span>();
      <span class="kw">this</span>.<span class="fn">handleDbErrors</span>(error);
    } <span class="kw">finally</span> {
      <span class="kw">await</span> queryRunner.<span class="fn">release</span>(); <span class="cm">// siempre liberar la conexión</span>
    }
  }
}`
      },
      quiz: {
        q: "¿Por qué usar una transacción al actualizar producto + imágenes?",
        options: [
          "Para que la operación sea más rápida",
          "Para garantizar que si falla cualquier paso, todos los cambios se revierten",
          "TypeORM lo requiere para relaciones OneToMany",
          "Para evitar que otros usuarios lean datos durante la actualización"
        ],
        correct: 1,
        feedback: "Sin transacción: podrías eliminar las imágenes antiguas y fallar al guardar las nuevas — el producto queda sin imágenes. Con transacción, si cualquier paso falla, el rollback deja todo como estaba."
      }
    },
    {
      heading: "Aplanar imágenes en la respuesta",
      body: `
<p>Por defecto TypeORM devuelve las imágenes como objetos <code>{ id, url, product }</code>. Para la respuesta de la API, es más limpio devolver solo los URLs como array de strings.</p>
      `,
      code: {
        lang: "typescript",
        label: "findOne — cargar imágenes y aplanar respuesta",
        content: `<span class="kw">async</span> <span class="fn">findOne</span>(id: <span class="tp">string</span>) {
  <span class="kw">const</span> product = <span class="kw">await this</span>.productRepository.<span class="fn">findOne</span>({
    where: { id },
    relations: { images: <span class="kw">true</span> },  <span class="cm">// carga la relación</span>
  });
  <span class="kw">if</span> (!product) <span class="kw">throw new</span> <span class="fn">NotFoundException</span>(...);
  <span class="kw">return</span> product;
}

<span class="cm">// Para aplanar en el controlador o con un método helper:</span>
<span class="kw">async</span> <span class="fn">findOnePlain</span>(id: <span class="tp">string</span>) {
  <span class="kw">const</span> { images = [], ...rest } = <span class="kw">await this</span>.<span class="fn">findOne</span>(id);
  <span class="kw">return</span> {
    ...rest,
    images: images.<span class="fn">map</span>(img => img.url),  <span class="cm">// [ '/product1.jpg', '/product2.jpg' ]</span>
  };
}`
      }
    },
    {
      heading: "Product SEED masivo con imágenes",
      body: `
<p>El SEED de TesloShop carga productos con sus imágenes de una vez. Para una inserción masiva limpia, primero borras todos los registros y luego insertas en una transacción.</p>
      `,
      code: {
        lang: "typescript",
        label: "seed.service.ts — SEED masivo con QueryRunner",
        content: `<span class="kw">async</span> <span class="fn">runSeed</span>() {
  <span class="kw">await this</span>.<span class="fn">deleteTables</span>();

  <span class="kw">const</span> queryRunner = <span class="kw">this</span>.dataSource.<span class="fn">createQueryRunner</span>();
  <span class="kw">await</span> queryRunner.<span class="fn">connect</span>();
  <span class="kw">await</span> queryRunner.<span class="fn">startTransaction</span>();

  <span class="kw">try</span> {
    <span class="kw">for</span> (<span class="kw">const</span> product <span class="kw">of</span> initialData.products) {
      <span class="kw">const</span> { images, ...productData } = product;
      <span class="kw">const</span> p = queryRunner.manager.<span class="fn">create</span>(Product, productData);
      p.images = images.<span class="fn">map</span>(url => queryRunner.manager.<span class="fn">create</span>(ProductImage, { url }));
      <span class="kw">await</span> queryRunner.manager.<span class="fn">save</span>(p);
    }
    <span class="kw">await</span> queryRunner.<span class="fn">commitTransaction</span>();
    <span class="kw">return</span> <span class="str">'Seed ejecutado'</span>;
  } <span class="kw">catch</span> {
    <span class="kw">await</span> queryRunner.<span class="fn">rollbackTransaction</span>();
    <span class="kw">throw new</span> <span class="fn">InternalServerErrorException</span>(<span class="str">'Error en seed'</span>);
  } <span class="kw">finally</span> {
    <span class="kw">await</span> queryRunner.<span class="fn">release</span>();
  }
}`
      }
    }
  ]
};
