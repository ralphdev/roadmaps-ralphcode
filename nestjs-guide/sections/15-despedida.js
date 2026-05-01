export default {
  title: "Despedida del curso",
  desc: "Cierre del curso y resumen de todo lo aprendido en el camino de NestJS.",
  lectures: [
    {
      heading: "Resumen del curso",
      body: `
<p>Completaste el curso completo de NestJS. Este es el recorrido que hiciste:</p>
<ul>
  <li><strong>Primeros pasos</strong> — CLI, módulos, controladores, servicios, DI, pipes y exception filters con CarDealership</li>
  <li><strong>DTOs y validación</strong> — class-validator, class-transformer, ValidationPipe global, UUIDs</li>
  <li><strong>Brands CRUD</strong> — nest generate resource, inyección de servicios entre módulos, SEED</li>
  <li><strong>Build de producción</strong> — compilar y ejecutar el build optimizado</li>
  <li><strong>MongoDB Pokedex</strong> — Mongoose, schemas, modelos, CustomPipes, CRUD con base de datos real</li>
  <li><strong>Seed y paginación</strong> — HTTP desde NestJS (Axios), inserts masivos, custom providers, Transform DTOs</li>
  <li><strong>Variables de entorno</strong> — ConfigModule, ConfigService, joi, Docker, deploy en la nube</li>
  <li><strong>TypeORM + Postgres</strong> — entidades, repositorios, QueryBuilder, BeforeInsert/BeforeUpdate, TesloShop</li>
  <li><strong>Relaciones TypeORM</strong> — OneToMany, ManyToOne, transacciones, cascade, SEED masivo</li>
  <li><strong>Carga de archivos</strong> — Multer, validación, diskStorage, servir archivos controlados, secureUrl</li>
  <li><strong>Autenticación</strong> — bcrypt, Passport, JWT, guards, custom decorators, composición, roles</li>
  <li><strong>Documentación OpenAPI</strong> — Swagger, ApiProperty, ApiResponse, PartialType de @nestjs/swagger</li>
  <li><strong>WebSockets</strong> — Socket.IO, Gateways, identificación de clientes, JWT en handshake, duplicados</li>
  <li><strong>Deploy</strong> — Neon (PostgreSQL serverless), Render (backend + static frontend)</li>
</ul>
      `,
      callout: { title: "¿Qué sigue?", text: "Microservicios con NestJS, GraphQL, CQRS, testing con Jest, y CI/CD avanzado son los siguientes pasos naturales. La documentación oficial de NestJS (docs.nestjs.com) cubre todos estos temas con la misma calidad." }
    },
    {
      heading: "Conceptos clave para llevar",
      body: `
<p>Los patrones que usarás en cada proyecto NestJS real:</p>
<ul>
  <li><strong>Módulos</strong> — la unidad de organización. Cada feature en su módulo.</li>
  <li><strong>Inyección de dependencias</strong> — no instancies servicios con <code>new</code>. Declara qué necesitas, NestJS lo provee.</li>
  <li><strong>Pipes</strong> — transformación y validación de datos entrantes.</li>
  <li><strong>Guards</strong> — control de acceso. AuthGuard, RoleGuard.</li>
  <li><strong>Interceptors</strong> — transformación de respuestas, logging, caché.</li>
  <li><strong>Decoradores</strong> — la forma de extender el comportamiento sin modificar la clase base.</li>
  <li><strong>Variables de entorno</strong> — nunca hardcodear secrets. ConfigModule + joi.</li>
  <li><strong>DTOs</strong> — contrato de datos entre capas. class-validator para validar, class-transformer para transformar.</li>
</ul>
      `,
      quiz: {
        q: "¿Cuál es la regla de oro para gestionar dependencias entre servicios de distintos módulos?",
        options: [
          "Importar directamente el archivo del servicio",
          "Usar imports[] en el módulo consumidor y exports[] en el módulo proveedor",
          "Instanciar el servicio con new dentro del servicio consumidor",
          "Registrar todos los servicios en el AppModule"
        ],
        correct: 1,
        feedback: "El módulo proveedor declara el servicio en exports[]. El módulo consumidor lo incluye en imports[]. NestJS resuelve la inyección automáticamente. Esta es la forma correcta de compartir servicios entre módulos sin acoplar los módulos directamente."
      }
    }
  ]
};
