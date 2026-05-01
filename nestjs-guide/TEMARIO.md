# Temario NestJS Guide

## Primeros pasos en Nest

- Introducción a la sección
- Temas puntuales de la sección
- ¿Qué es Nest? y ¿Por qué usarlo?
- Instalar Nest CLI - Command Line Interface
- Generar nuestro primer proyecto - CarDealership
- Explicación de cada archivo y directorio
- Módulos
- Controladores
- Desactivar Prettier
- Obtener un carro por ID
- Servicios
- Inyección de dependencias
- Pipes
- Exception Filters
- Post, Patch y Delete

## DTOs y Validación de información

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de la sección
- Interfaces y UUID
- Pipe - ParseUUIDPipe
- DTO - Data Transfer Object
- ValidationPipe - Class Validator y Class Transformer
- Pipes Globales - A nivel de Aplicación
- Crear el nuevo carro
- Actualizar un carro
- Actualizar el listado de carros
- Borrar un carro
- Resumen de la sección

## Nest CLI Resource - Brands CRUD

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de la sección
- Nest CLI Resource - Brands
- Crear CRUD completo de Brands
- Crear servicio SEED para cargar datos
- Preparar servicios para insertar SEED
- Inyectar servicios en otros servicios

## Generar build de producción básico

- Introducción a la sección
- Generar build de producción básico

## MongoDB Pokedex

- Introducción a la sección
- Temas puntuales de la sección
- Inicio de proyecto - Pokedex
- Servir contenido estático
- Global Prefix
- Docker - DockerCompose - MongoDB
- README.md
- Conectar Nest con Mongo
- Crear esquemas y Modelos
- POST - Recibir y validar la data
- Crear Pokémon en base de datos
- Responder un error específico
- FindOneBy - Buscar por nombre, MongoId y no
- Actualizar Pokemon en base de datos
- Tarea - Validar valores únicos
- Eliminar un Pokemon
- CustomPipes - ParseMongoIdPipe
- Validar y eliminar en una sola consulta
- Respaldar código fuente en GitHub

## Seed y Paginación

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de proyecto
- Crear módulo SEED
- Nota de actualización - Axios
- Realizar petición http desde Nest
- Tarea - Insertar Pokemons por lote
- Resolución - Insertar Pokemons por lote
- Insertar multiples registros simultáneamente
- Crear un custom provider - opcional
- Paginación de Pokemons
- Transform DTOs

## Variables de entorno - Deployment y Dockerizar la aplicación

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de proyecto
- Configuración de variables de entorno
- Configuration Loader
- ConfigurationService
- joi - ValidationSchema
- ENV Template - Readme
- MongoDB - Aprovisionamiento
- Desplegar aplicación en la nube
- Bonus - Docker ¿Dockerizar?
- Bonus: Explicación general del Dockerfile
- Bonus: Definir la construcción de la imagen
- Bonus: Construir la imagen
- Bonus: Conservar la base de datos y analizar imagen
- Actualizar Readme.md

## TypeORM - Postgres

- Introducción a la sección
- Temas puntuales de la sección
- Inicio de proyecto - TesloShop
- Docker - Instalar y correr Postgres
- Conectar Postgres con Nest
- TypeORM - Entity - Product
- Entidad sin relaciones
- Create Product DTO
- Insertar usando TypeORM
- Manejo de errores
- BeforeInsert y BeforeUpdate
- Get y Delete TypeORM
- Paginar en TypeORM
- Buscar por Slug o UUID
- QueryBuilder
- Update en TypeORM
- BeforeUpdate
- Nueva columna - Tags

## Relaciones en TypeORM

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de la sección
- Breve explicación de lo que haremos
- ProductImage Entity
- OneToMany y ManyToOne
- Crear imágenes de producto
- Aplanar las imágenes
- Query Runner
- Transacciones
- Eliminación en cascada
- Product Seed
- Insertar de forma masiva
- Renombrar tablas

## Carga de archivos

- Inicio de sección
- Temas puntuales de la sección
- Continuación de la sección
- Subir un archivo al backend
- Validar archivos
- Guardar imagen en filesystem
- Renombrar el archivo subido
- Servir archivos de manera controlada
- Retornar el secureUrl
- Otras formas de desplegar archivos
- Colocar imágenes en el directorio estático

## Autenticación de autorización

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de proyecto
- Entidad de Usuarios
- Crear usuario
- Encriptar la contraseña
- Login de usuario
- Nest Authentication - Passport
- Módulos Asíncronos
- JwtStrategy
- JwtStrategy - Parte 2
- Generar un JWT
- Private Route - General
- Tarea: Cambiar email por id en el Payload
- Custom Property Decorator - GetUser
- Tarea - Custom Decorators
- Custom Guard y Custom Decorator
- Verificar rol del usuario
- Custom Decorator - RoleProtected
- Composición de Decoradores
- Auth en otros módulos
- Usuario que creó el producto
- Insertar userId en los productos
- SEED de usuarios, productos e imágenes
- Encriptar contraseña de los usuarios del SEED
- Check AuthStatus

## Documentación - OpenAPI

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de la sección
- Documentación mediante Postman
- Nestjs swagger - OpenAPI Specification
- Tags, ApiProperty y ApiResponse
- Expandir el ApiProperty
- Documentar DTOs
- Tarea - Documentación

## Websockets

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de la sección
- Websocket Gateways
- Server - Escuchar conexiones y desconexiones
- Cliente - Vite Vanilla TypeScript
- Server - Mantener identificados los clientes
- Cliente - Detectar conexión y desconexión
- Cliente - Clientes conectados
- Emitir Cliente - Escuchar Servidor
- Formas de emitir desde el servidor
- Preparar cliente para enviar JWT
- Validar JWT del Handshake
- Enlazar Socket con Usuario
- Desconectar usuarios duplicados

## Desplegar toda la aplicación a producción

- Introducción a la sección
- Temas puntuales de la sección
- Continuación de la sección
- PostgreSQL en la nube - NeonTech
- Desplegar en Render
- Desplegar Vite App - Frontend

## Despedida del curso

- Despedida del curso
