const roadmap = [
  {
    title: "Primeros pasos en Nest",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "¿Qué es Nest? y ¿Por qué usarlo?" },
      { label: "Instalar Nest CLI - Command Line Interface" },
      { label: "Generar nuestro primer proyecto - CarDealership" },
      { label: "Explicación de cada archivo y directorio" },
      { label: "Módulos" },
      { label: "Controladores" },
      { label: "Desactivar Prettier" },
      { label: "Obtener un carro por ID" },
      { label: "Servicios" },
      { label: "Inyección de dependencias" },
      { label: "Pipes" },
      { label: "Exception Filters" },
      { label: "Post, Patch y Delete" },
    ]
  },
  {
    title: "DTOs y Validación de información",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "Interfaces y UUID" },
      { label: "Pipe - ParseUUIDPipe" },
      { label: "DTO - Data Transfer Object" },
      { label: "ValidationPipe - Class Validator y Class Transformer" },
      { label: "Pipes Globales - A nivel de Aplicación" },
      { label: "Crear el nuevo carro" },
      { label: "Actualizar un carro" },
      { label: "Actualizar el listado de carros" },
      { label: "Borrar un carro" },
      { label: "Resumen de la sección" },
    ]
  },
  {
    title: "Nest CLI Resource - Brands CRUD",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "Nest CLI Resource - Brands" },
      { label: "Crear CRUD completo de Brands" },
      { label: "Crear servicio SEED para cargar datos" },
      { label: "Preparar servicios para insertar SEED" },
      { label: "Inyectar servicios en otros servicios" },
    ]
  },
  {
    title: "Generar build de producción básico",
    items: [
      { label: "Introducción a la sección" },
      { label: "Generar build de producción básico" },
    ]
  },
  {
    title: "MongoDB Pokedex",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Inicio de proyecto - Pokedex" },
      { label: "Servir contenido estático" },
      { label: "Global Prefix" },
      { label: "Docker - DockerCompose - MongoDB" },
      { label: "README.md" },
      { label: "Conectar Nest con Mongo" },
      { label: "Crear esquemas y Modelos" },
      { label: "POST - Recibir y validar la data" },
      { label: "Crear Pokémon en base de datos" },
      { label: "Responder un error específico" },
      { label: "FindOneBy - Buscar por nombre, MongoId y no" },
      { label: "Actualizar Pokemon en base de datos" },
      { label: "Tarea - Validar valores únicos" },
      { label: "Eliminar un Pokemon" },
      { label: "CustomPipes - ParseMongoIdPipe" },
      { label: "Validar y eliminar en una sola consulta" },
      { label: "Respaldar código fuente en GitHub" },
    ]
  },
  {
    title: "Seed y Paginación",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de proyecto" },
      { label: "Crear módulo SEED" },
      { label: "Nota de actualización - Axios" },
      { label: "Realizar petición http desde Nest" },
      { label: "Tarea - Insertar Pokemons por lote" },
      { label: "Resolución - Insertar Pokemons por lote" },
      { label: "Insertar multiples registros simultáneamente" },
      { label: "Crear un custom provider - opcional" },
      { label: "Paginación de Pokemons" },
      { label: "Transform DTOs" },
    ]
  },
  {
    title: "Variables de entorno - Deployment y Dockerizar",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de proyecto" },
      { label: "Configuración de variables de entorno" },
      { label: "Configuration Loader" },
      { label: "ConfigurationService" },
      { label: "joi - ValidationSchema" },
      { label: "ENV Template - Readme" },
      { label: "MongoDB - Aprovisionamiento" },
      { label: "Desplegar aplicación en la nube" },
      { label: "Bonus - Docker ¿Dockerizar?" },
      { label: "Bonus: Explicación general del Dockerfile" },
      { label: "Bonus: Definir la construcción de la imagen" },
      { label: "Bonus: Construir la imagen" },
      { label: "Bonus: Conservar la base de datos y analizar imagen" },
      { label: "Actualizar Readme.md" },
    ]
  },
  {
    title: "TypeORM - Postgres",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Inicio de proyecto - TesloShop" },
      { label: "Docker - Instalar y correr Postgres" },
      { label: "Conectar Postgres con Nest" },
      { label: "TypeORM - Entity - Product" },
      { label: "Entidad sin relaciones" },
      { label: "Create Product DTO" },
      { label: "Insertar usando TypeORM" },
      { label: "Manejo de errores" },
      { label: "BeforeInsert y BeforeUpdate" },
      { label: "Get y Delete TypeORM" },
      { label: "Paginar en TypeORM" },
      { label: "Buscar por Slug o UUID" },
      { label: "QueryBuilder" },
      { label: "Update en TypeORM" },
      { label: "BeforeUpdate" },
      { label: "Nueva columna - Tags" },
    ]
  },
  {
    title: "Relaciones en TypeORM",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "Breve explicación de lo que haremos" },
      { label: "ProductImage Entity" },
      { label: "OneToMany y ManyToOne" },
      { label: "Crear imágenes de producto" },
      { label: "Aplanar las imágenes" },
      { label: "Query Runner" },
      { label: "Transacciones" },
      { label: "Eliminación en cascada" },
      { label: "Product Seed" },
      { label: "Insertar de forma masiva" },
      { label: "Renombrar tablas" },
    ]
  },
  {
    title: "Carga de archivos",
    items: [
      { label: "Inicio de sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "Subir un archivo al backend" },
      { label: "Validar archivos" },
      { label: "Guardar imagen en filesystem" },
      { label: "Renombrar el archivo subido" },
      { label: "Servir archivos de manera controlada" },
      { label: "Retornar el secureUrl" },
      { label: "Otras formas de desplegar archivos" },
      { label: "Colocar imágenes en el directorio estático" },
    ]
  },
  {
    title: "Autenticación y autorización",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de proyecto" },
      { label: "Entidad de Usuarios" },
      { label: "Crear usuario" },
      { label: "Encriptar la contraseña" },
      { label: "Login de usuario" },
      { label: "Nest Authentication - Passport" },
      { label: "Módulos Asíncronos" },
      { label: "JwtStrategy" },
      { label: "JwtStrategy - Parte 2" },
      { label: "Generar un JWT" },
      { label: "Private Route - General" },
      { label: "Tarea: Cambiar email por id en el Payload" },
      { label: "Custom Property Decorator - GetUser" },
      { label: "Tarea - Custom Decorators" },
      { label: "Custom Guard y Custom Decorator" },
      { label: "Verificar rol del usuario" },
      { label: "Custom Decorator - RoleProtected" },
      { label: "Composición de Decoradores" },
      { label: "Auth en otros módulos" },
      { label: "Usuario que creó el producto" },
      { label: "Insertar userId en los productos" },
      { label: "SEED de usuarios, productos e imágenes" },
      { label: "Encriptar contraseña de los usuarios del SEED" },
      { label: "Check AuthStatus" },
    ]
  },
  {
    title: "Documentación - OpenAPI",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "Documentación mediante Postman" },
      { label: "Nestjs swagger - OpenAPI Specification" },
      { label: "Tags, ApiProperty y ApiResponse" },
      { label: "Expandir el ApiProperty" },
      { label: "Documentar DTOs" },
      { label: "Tarea - Documentación" },
    ]
  },
  {
    title: "Websockets",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "Websocket Gateways" },
      { label: "Server - Escuchar conexiones y desconexiones" },
      { label: "Cliente - Vite Vanilla TypeScript" },
      { label: "Server - Mantener identificados los clientes" },
      { label: "Cliente - Detectar conexión y desconexión" },
      { label: "Cliente - Clientes conectados" },
      { label: "Emitir Cliente - Escuchar Servidor" },
      { label: "Formas de emitir desde el servidor" },
      { label: "Preparar cliente para enviar JWT" },
      { label: "Validar JWT del Handshake" },
      { label: "Enlazar Socket con Usuario" },
      { label: "Desconectar usuarios duplicados" },
    ]
  },
  {
    title: "Desplegar toda la aplicación a producción",
    items: [
      { label: "Introducción a la sección" },
      { label: "Temas puntuales de la sección" },
      { label: "Continuación de la sección" },
      { label: "PostgreSQL en la nube - NeonTech" },
      { label: "Desplegar en Render" },
      { label: "Desplegar Vite App - Frontend" },
    ]
  },
  {
    title: "Despedida del curso",
    items: [
      { label: "Despedida del curso" },
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
