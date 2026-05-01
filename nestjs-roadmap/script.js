const roadmap = [
  {
    title: "Bases necesarias antes de NestJS",
    items: [
      { label: "Node.js (módulos, async/await, streams)" },
      { label: "TypeScript (tipos, clases, decoradores, genéricos)" },
      { label: "HTTP y REST (verbos, status codes, headers)" },
      { label: "NPM / módulos ES" },
      { label: "Express básico (opcional pero útil)" },
    ]
  },
  {
    title: "Primeros pasos con NestJS",
    items: [
      { label: "Instalar CLI: npm i -g @nestjs/cli" },
      { label: "Crear proyecto: nest new proyecto" },
      { label: "Estructura de carpetas del proyecto" },
      { label: "Módulos, Controladores y Providers" },
      { label: "Decoradores principales (@Module, @Controller, @Injectable)" },
      { label: "Inyección de dependencias (DI)" },
      { label: "Ciclo de vida de una request" },
    ]
  },
  {
    title: "HTTP y enrutamiento",
    items: [
      { label: "@Get, @Post, @Put, @Patch, @Delete" },
      { label: "@Param, @Query, @Body, @Headers" },
      { label: "Respuestas con @Res y códigos de estado" },
      { label: "Prefijos de ruta con @Controller('path')" },
      { label: "Versioning de API" },
    ]
  },
  {
    title: "DTOs y validación",
    items: [
      { label: "Data Transfer Objects (DTO)" },
      { label: "class-validator (decoradores de validación)" },
      { label: "class-transformer (transformar payload)" },
      { label: "ValidationPipe global" },
      { label: "Pipes personalizados" },
    ]
  },
  {
    title: "Base de datos",
    items: [
      { sub: "TypeORM (opción recomendada para SQL)" },
      { label: "Configurar @nestjs/typeorm" },
      { label: "Entities y columnas" },
      { label: "Repository pattern" },
      { label: "Relaciones: OneToMany, ManyToOne, ManyToMany" },
      { label: "Migraciones" },
      { sub: "Mongoose (para MongoDB)" },
      { label: "Configurar @nestjs/mongoose" },
      { label: "Schemas con decoradores" },
      { label: "Models e inyección" },
      { sub: "Prisma (alternativa moderna)" },
      { label: "Configurar Prisma con NestJS" },
      { label: "PrismaService como provider" },
    ]
  },
  {
    title: "Autenticación y autorización",
    items: [
      { label: "Guards (@UseGuards)" },
      { label: "JWT con @nestjs/jwt y passport" },
      { label: "Estrategias Passport (local, jwt)" },
      { label: "AuthGuard y JwtAuthGuard" },
      { label: "Decorador @Roles y RolesGuard" },
      { label: "Refresh tokens" },
      { label: "OAuth2 / Social login (opcional)" },
    ]
  },
  {
    title: "Middleware, Interceptors y Filters",
    items: [
      { label: "Middleware (antes del controlador)" },
      { label: "Interceptors (antes y después de handlers)" },
      { label: "Exception Filters (@Catch)" },
      { label: "HttpExceptionFilter global" },
      { label: "Orden de ejecución del pipeline" },
    ]
  },
  {
    title: "Módulos avanzados",
    items: [
      { label: "Módulos dinámicos (forRoot, forFeature, register)" },
      { label: "Módulos globales (@Global)" },
      { label: "Módulos de configuración (@nestjs/config)" },
      { label: "Variables de entorno con .env" },
      { label: "ConfigService y validación de variables" },
    ]
  },
  {
    title: "Testing",
    items: [
      { label: "Unit tests con Jest" },
      { label: "Testing module de NestJS" },
      { label: "Mocks de services y repositories" },
      { label: "E2E tests con Supertest" },
      { label: "Coverage reports" },
    ]
  },
  {
    title: "TypeORM – Avanzado",
    items: [
      { label: "QueryBuilder" },
      { label: "Transacciones" },
      { label: "Subscribers y eventos de entidad" },
      { label: "Índices y optimización" },
    ]
  },
  {
    title: "Recursos en NestJS",
    items: [
      { label: "nest generate resource (CRUD completo)" },
      { label: "Estructura módulo por feature" },
      { label: "Separar lógica en Services" },
    ]
  },
  {
    title: "GraphQL con NestJS",
    items: [
      { label: "Configurar @nestjs/graphql con Apollo" },
      { label: "Code-first vs Schema-first" },
      { label: "Resolvers, Queries, Mutations" },
      { label: "Subscriptions" },
      { label: "DataLoader para N+1" },
    ]
  },
  {
    title: "WebSockets",
    items: [
      { label: "@nestjs/websockets y Socket.io" },
      { label: "Gateways (@WebSocketGateway)" },
      { label: "@SubscribeMessage" },
      { label: "Namespaces y rooms" },
    ]
  },
  {
    title: "Microservicios",
    items: [
      { label: "Patrón de microservicios en NestJS" },
      { label: "Transporters: TCP, Redis, NATS, RabbitMQ, Kafka" },
      { label: "@Client y ClientProxy" },
      { label: "MessagePattern y EventPattern" },
      { label: "Hybrid apps (HTTP + microservicio)" },
    ]
  },
  {
    title: "Colas y tareas asíncronas",
    items: [
      { label: "BullMQ con @nestjs/bull" },
      { label: "Processors y jobs" },
      { label: "Tareas programadas con @nestjs/schedule" },
      { label: "@Cron, @Interval, @Timeout" },
    ]
  },
  {
    title: "Caché",
    items: [
      { label: "CacheModule (@nestjs/cache-manager)" },
      { label: "Cache en memoria vs Redis" },
      { label: "@UseInterceptors(CacheInterceptor)" },
      { label: "Cache manual con CacheManager" },
    ]
  },
  {
    title: "Seguridad",
    items: [
      { label: "Helmet (headers HTTP seguros)" },
      { label: "Rate limiting (@nestjs/throttler)" },
      { label: "CORS" },
      { label: "CSRF protection" },
      { label: "Sanitización de inputs" },
    ]
  },
  {
    title: "Documentación – Swagger",
    items: [
      { label: "@nestjs/swagger setup" },
      { label: "@ApiTags, @ApiOperation, @ApiResponse" },
      { label: "@ApiProperty en DTOs" },
      { label: "Bearer auth en Swagger" },
    ]
  },
  {
    title: "Deploy y producción",
    items: [
      { label: "Build: nest build" },
      { label: "Docker y docker-compose" },
      { label: "Variables de entorno por ambiente" },
      { label: "PM2 o Node cluster" },
      { label: "Deploy en Railway, Render, AWS, GCP" },
      { label: "CI/CD con GitHub Actions" },
    ]
  },
  {
    title: "Buenas prácticas y arquitectura",
    items: [
      { label: "Clean Architecture en NestJS" },
      { label: "CQRS con @nestjs/cqrs" },
      { label: "Event Sourcing (opcional)" },
      { label: "Hexagonal architecture" },
      { label: "Logging estructurado (Winston, Pino)" },
      { label: "OpenTelemetry / trazabilidad" },
    ]
  },
];

const STORAGE_KEY = 'nestjs-roadmap-v1';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

let state = loadState();
let total = 0;

function buildRoadmap() {
  const container = document.getElementById('roadmap');
  container.innerHTML = '';

  roadmap.forEach((section, si) => {
    const div = document.createElement('div');
    div.className = 'section';

    const realItems = section.items.filter(i => !i.sub);
    const doneCount = realItems.filter(item => state[`${si}-${item.label}`]).length;
    total = roadmap.reduce((acc, s) => acc + s.items.filter(i => !i.sub).length, 0);

    div.innerHTML = `
      <div class="section-header">
        <span class="section-num">${String(si + 1).padStart(2, '0')}</span>
        <span class="section-title">${section.title}</span>
        <span class="section-count">${doneCount}/${realItems.length}</span>
      </div>
      <div class="items" id="section-${si}"></div>
    `;

    container.appendChild(div);

    const itemsEl = div.querySelector(`#section-${si}`);
    section.items.forEach((item, ii) => {
      if (item.sub) {
        const sub = document.createElement('div');
        sub.className = 'subsection-label';
        sub.textContent = item.sub;
        itemsEl.appendChild(sub);
        return;
      }

      const key = `${si}-${item.label}`;
      const done = !!state[key];
      const el = document.createElement('div');
      el.className = 'item' + (done ? ' done' : '');
      el.innerHTML = `
        <div class="checkbox"><span class="check-icon">✓</span></div>
        <span class="item-label">${item.label}</span>
      `;
      el.onclick = () => toggle(key, el, si);
      itemsEl.appendChild(el);
    });
  });

  updateProgress();
}

function toggle(key, el, si) {
  state[key] = !state[key];
  saveState(state);
  el.classList.toggle('done', state[key]);
  updateSectionCount(si);
  updateProgress();
}

function updateSectionCount(si) {
  const section = roadmap[si];
  const realItems = section.items.filter(i => !i.sub);
  const doneCount = realItems.filter(item => state[`${si}-${item.label}`]).length;
  const countEl = document.querySelector(`#roadmap .section:nth-child(${si + 1}) .section-count`);
  if (countEl) countEl.textContent = `${doneCount}/${realItems.length}`;
}

function updateProgress() {
  const done = Object.values(state).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('pct').textContent = `${pct}%`;
  document.getElementById('fill').style.width = pct + '%';
}

function resetAll() {
  if (!confirm('¿Reiniciar todo el progreso?')) return;
  state = {};
  saveState(state);
  buildRoadmap();
}

buildRoadmap();
