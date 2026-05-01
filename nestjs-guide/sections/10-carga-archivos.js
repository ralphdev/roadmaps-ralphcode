export default {
  title: "Carga de archivos",
  desc: "Subir, validar, renombrar y servir archivos estáticos con NestJS — Multer, custom FileInterceptor y secureUrl.",
  lectures: [
    {
      heading: "Subir un archivo al backend",
      body: `
<p>NestJS usa <strong>Multer</strong> internamente para gestionar la carga de archivos. El decorador <code>@UseInterceptors(FileInterceptor)</code> enlaza el campo del form-data con el parámetro del controlador.</p>
<ul>
  <li><code>FileInterceptor('fieldName')</code> — captura un único archivo</li>
  <li><code>FilesInterceptor('fieldName', maxCount)</code> — captura múltiples</li>
  <li><code>@UploadedFile()</code> — inyecta el archivo en el handler</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "files.controller.ts — endpoint de carga",
        content: `<span class="kw">import</span> { Controller, Post, UploadedFile, UseInterceptors } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { FileInterceptor } <span class="kw">from</span> <span class="str">'@nestjs/platform-express'</span>;

<span class="dec">@Controller</span>(<span class="str">'files'</span>)
<span class="kw">export class</span> <span class="tp">FilesController</span> {
  <span class="dec">@Post</span>(<span class="str">'product'</span>)
  <span class="dec">@UseInterceptors</span>(FileInterceptor(<span class="str">'file'</span>))
  uploadProductImage(<span class="dec">@UploadedFile</span>() file: Express.Multer.File) {
    <span class="kw">return</span> { fileName: file.originalname };
  }
}`
      },
      callout: { title: "Instalar tipos", text: "npm i -D @types/multer — sin esto TypeScript no reconoce Express.Multer.File." }
    },
    {
      heading: "Validar archivos — tamaño y tipo MIME",
      body: `
<p>Multer acepta cualquier archivo por defecto. Debes validar explícitamente el tipo y el tamaño. NestJS lo hace con <strong>ParseFilePipe</strong> y validators integrados.</p>
<ul>
  <li><code>MaxFileSizeValidator</code> — rechaza archivos sobre el límite</li>
  <li><code>FileTypeValidator</code> — acepta solo los MIME types indicados</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "Validar imagen — solo jpg/png, máx 1MB",
        content: `<span class="kw">import</span> {
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator
} <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="dec">@Post</span>(<span class="str">'product'</span>)
<span class="dec">@UseInterceptors</span>(FileInterceptor(<span class="str">'file'</span>))
uploadProductImage(
  <span class="dec">@UploadedFile</span>(
    <span class="kw">new</span> ParseFilePipe({
      validators: [
        <span class="kw">new</span> MaxFileSizeValidator({ maxSize: <span class="num">1024</span> * <span class="num">1024</span> }),
        <span class="kw">new</span> FileTypeValidator({ fileType: <span class="str">'image/(jpeg|png)'</span> }),
      ],
    })
  ) file: Express.Multer.File,
) {
  <span class="kw">return</span> { fileName: file.originalname };
}`
      },
      quiz: {
        q: "¿Qué validador rechaza automáticamente un archivo de 3MB si el límite es 1MB?",
        options: [
          "FileTypeValidator",
          "MaxFileSizeValidator",
          "ParseFilePipe directamente",
          "El decorador @UploadedFile"
        ],
        correct: 1,
        feedback: "MaxFileSizeValidator compara el tamaño del archivo con el máximo configurado. Si lo supera, NestJS devuelve 400 automáticamente sin llegar al handler."
      }
    },
    {
      heading: "Guardar imagen en filesystem y renombrar",
      body: `
<p>Por defecto Multer guarda los archivos en memoria. Para persistirlos en disco configura <code>diskStorage</code> con la ruta de destino y una función que genera el nombre del archivo.</p>
<p>El nombre original no es seguro — puede tener caracteres raros o colisiones. Lo mejor: usar un <strong>UUID</strong> como nombre, conservando la extensión original.</p>
      `,
      code: {
        lang: "typescript",
        label: "helpers/fileNamer.helper.ts + diskStorage config",
        content: `<span class="kw">import</span> { v4 as uuid } <span class="kw">from</span> <span class="str">'uuid'</span>;
<span class="kw">import</span> { extname } <span class="kw">from</span> <span class="str">'path'</span>;

<span class="kw">export const</span> fileNamer = (
  req: <span class="kw">any</span>,
  file: Express.Multer.File,
  callback: Function,
) => {
  <span class="kw">const</span> ext = extname(file.originalname);
  callback(<span class="kw">null</span>, <span class="str">\`\${uuid()}\${ext}\`</span>);
};

<span class="cm">// files.module.ts — configurar diskStorage</span>
<span class="kw">import</span> { diskStorage } <span class="kw">from</span> <span class="str">'multer'</span>;

<span class="kw">const</span> multerOptions = {
  storage: diskStorage({
    destination: <span class="str">'./static/products'</span>,
    filename: fileNamer,
  }),
};

FileInterceptor(<span class="str">'file'</span>, multerOptions)`
      }
    },
    {
      heading: "Servir archivos de manera controlada",
      body: `
<p>Usar <code>ServeStaticModule</code> expone TODO el directorio estático públicamente. Mejor: servir los archivos mediante un endpoint controlado con <code>@Res()</code>.</p>
<p>Esto permite agregar autenticación, logging o cualquier lógica antes de enviar el archivo.</p>
      `,
      code: {
        lang: "typescript",
        label: "files.controller.ts — servir imagen por nombre",
        content: `<span class="kw">import</span> { Get, Param, Res } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { Response } <span class="kw">from</span> <span class="str">'express'</span>;
<span class="kw">import</span> { join } <span class="kw">from</span> <span class="str">'path'</span>;
<span class="kw">import</span> { existsSync } <span class="kw">from</span> <span class="str">'fs'</span>;

<span class="dec">@Get</span>(<span class="str">'product/:imageName'</span>)
findProductImage(
  <span class="dec">@Param</span>(<span class="str">'imageName'</span>) imageName: <span class="tp">string</span>,
  <span class="dec">@Res</span>() res: <span class="tp">Response</span>,
) {
  <span class="kw">const</span> path = join(__dirname, <span class="str">'../../static/products'</span>, imageName);
  <span class="kw">if</span> (!existsSync(path))
    <span class="kw">throw new</span> <span class="tp">NotFoundException</span>(<span class="str">\`Imagen \${imageName} no encontrada\`</span>);
  res.sendFile(path);
}`
      },
      callout: { title: "Nota: @Res() bypasea NestJS", text: "Al inyectar @Res() tomas control total de la respuesta HTTP. NestJS no puede interceptar la respuesta después — no apliques interceptors globales de transformación sobre estos endpoints." }
    },
    {
      heading: "Retornar secureUrl",
      body: `
<p>Después de guardar la imagen, el endpoint debe devolver la URL completa donde el cliente puede acceder al archivo. Esa URL se construye desde el host de la petición y el nombre del archivo guardado.</p>
      `,
      code: {
        lang: "typescript",
        label: "Construir secureUrl en el controlador",
        content: `<span class="dec">@Post</span>(<span class="str">'product'</span>)
<span class="dec">@UseInterceptors</span>(FileInterceptor(<span class="str">'file'</span>, multerOptions))
uploadProductImage(
  <span class="dec">@UploadedFile</span>(validationPipe) file: Express.Multer.File,
  <span class="dec">@Req</span>() req: <span class="tp">Request</span>,
) {
  <span class="kw">const</span> secureUrl = <span class="str">\`\${req.protocol}://\${req.get('Host')}/files/product/\${file.filename}\`</span>;
  <span class="kw">return</span> { secureUrl };
}`
      }
    }
  ]
};
