export default {
  title: "Autenticación y autorización",
  desc: "JWT con Passport, entidad de usuarios, bcrypt, rutas privadas, custom decorators, guards y control de roles en TesloShop.",
  lectures: [
    {
      heading: "Entidad de Usuarios",
      body: `
<p>La autenticación empieza con la entidad <code>User</code>. Define los campos esenciales y aplica restricciones a nivel de base de datos.</p>
<ul>
  <li><code>email</code> — único, índice</li>
  <li><code>password</code> — nunca se selecciona por defecto (<code>select: false</code>)</li>
  <li><code>roles</code> — array de strings, default <code>['user']</code></li>
  <li><code>isActive</code> — soft-delete lógico</li>
</ul>
      `,
      code: {
        lang: "typescript",
        label: "user.entity.ts",
        content: `<span class="kw">import</span> { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } <span class="kw">from</span> <span class="str">'typeorm'</span>;

<span class="dec">@Entity</span>(<span class="str">'users'</span>)
<span class="kw">export class</span> <span class="tp">User</span> {
  <span class="dec">@PrimaryGeneratedColumn</span>(<span class="str">'uuid'</span>)
  id: <span class="tp">string</span>;

  <span class="dec">@Column</span>({ unique: <span class="kw">true</span> })
  email: <span class="tp">string</span>;

  <span class="dec">@Column</span>({ select: <span class="kw">false</span> })
  password: <span class="tp">string</span>;

  <span class="dec">@Column</span>(<span class="str">'text'</span>, { array: <span class="kw">true</span>, default: [<span class="str">'user'</span>] })
  roles: <span class="tp">string</span>[];

  <span class="dec">@Column</span>({ default: <span class="kw">true</span> })
  isActive: <span class="tp">boolean</span>;

  <span class="dec">@BeforeInsert</span>()
  <span class="dec">@BeforeUpdate</span>()
  checkFieldsBeforeInsert() {
    <span class="kw">this</span>.email = <span class="kw">this</span>.email.toLowerCase().trim();
  }
}`
      }
    },
    {
      heading: "Crear usuario y encriptar contraseña",
      body: `
<p>Nunca guardes contraseñas en texto plano. <strong>bcrypt</strong> aplica un hash unidireccional con salt. El <code>saltOrRounds</code> (factor de costo) controla cuánto tarda el hash — más alto = más seguro pero más lento.</p>
<p>Al crear el usuario: hash antes de guardar. Al login: <code>bcrypt.compareSync</code> compara el texto plano con el hash sin revelar la contraseña.</p>
      `,
      code: {
        lang: "typescript",
        label: "auth.service.ts — create + login",
        content: `<span class="kw">import</span> * <span class="kw">as</span> bcrypt <span class="kw">from</span> <span class="str">'bcrypt'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">AuthService</span> {
  <span class="kw">async</span> create(createUserDto: <span class="tp">CreateUserDto</span>) {
    <span class="kw">const</span> { password, ...userData } = createUserDto;
    <span class="kw">const</span> user = <span class="kw">this</span>.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, <span class="num">10</span>),
    });
    <span class="kw">await this</span>.userRepository.save(user);
    <span class="kw">delete</span> user.password;
    <span class="kw">return</span> { ...user, token: <span class="kw">this</span>.getJwt({ id: user.id }) };
  }

  <span class="kw">async</span> login(loginUserDto: <span class="tp">LoginUserDto</span>) {
    <span class="kw">const</span> { email, password } = loginUserDto;
    <span class="kw">const</span> user = <span class="kw">await this</span>.userRepository.findOne({
      where: { email },
      select: { email: <span class="kw">true</span>, password: <span class="kw">true</span>, id: <span class="kw">true</span> },
    });
    <span class="kw">if</span> (!user || !bcrypt.compareSync(password, user.password))
      <span class="kw">throw new</span> <span class="tp">UnauthorizedException</span>(<span class="str">'Credenciales incorrectas'</span>);
    <span class="kw">return</span> { ...user, token: <span class="kw">this</span>.getJwt({ id: user.id }) };
  }
}`
      },
      quiz: {
        q: "¿Por qué se usa select: false en la columna password de la entidad?",
        options: [
          "Para que TypeORM ignore la columna en migraciones",
          "Para que la contraseña no se retorne automáticamente en las queries",
          "Para encriptar el valor antes de guardarlo",
          "Para hacer la columna nullable"
        ],
        correct: 1,
        feedback: "select: false excluye la columna de los SELECT por defecto. Así nunca se expone accidentalmente la contraseña en una respuesta. Cuando la necesitas (para verificarla en login), la solicitas explícitamente con select: { password: true }."
      }
    },
    {
      heading: "Passport y JwtStrategy",
      body: `
<p><strong>Passport</strong> es el middleware de autenticación de Node.js. NestJS lo integra con <code>@nestjs/passport</code> y <code>passport-jwt</code>.</p>
<p>El flujo: cliente envía JWT en header → Passport extrae el token → <code>JwtStrategy.validate()</code> decodifica el payload → retorna el usuario que NestJS inyecta en <code>req.user</code>.</p>
      `,
      code: {
        lang: "typescript",
        label: "jwt.strategy.ts",
        content: `<span class="kw">import</span> { Injectable, UnauthorizedException } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { PassportStrategy } <span class="kw">from</span> <span class="str">'@nestjs/passport'</span>;
<span class="kw">import</span> { ExtractJwt, Strategy } <span class="kw">from</span> <span class="str">'passport-jwt'</span>;
<span class="kw">import</span> { ConfigService } <span class="kw">from</span> <span class="str">'@nestjs/config'</span>;

<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">JwtStrategy</span> <span class="kw">extends</span> <span class="tp">PassportStrategy</span>(Strategy) {
  <span class="kw">constructor</span>(
    configService: <span class="tp">ConfigService</span>,
    <span class="kw">private</span> userRepository: <span class="tp">Repository</span>&lt;<span class="tp">User</span>&gt;,
  ) {
    <span class="kw">super</span>({
      secretOrKey: configService.get(<span class="str">'JWT_SECRET'</span>),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  <span class="kw">async</span> validate(payload: <span class="tp">JwtPayload</span>): Promise&lt;<span class="tp">User</span>&gt; {
    <span class="kw">const</span> { id } = payload;
    <span class="kw">const</span> user = <span class="kw">await this</span>.userRepository.findOneBy({ id });
    <span class="kw">if</span> (!user || !user.isActive)
      <span class="kw">throw new</span> <span class="tp">UnauthorizedException</span>(<span class="str">'Token no válido'</span>);
    <span class="kw">return</span> user;
  }
}`
      }
    },
    {
      heading: "Módulos asíncronos — JwtModule con ConfigService",
      body: `
<p>El secreto del JWT debe venir de variables de entorno, no estar hardcodeado. <code>JwtModule.registerAsync()</code> permite inyectar <code>ConfigService</code> dentro de la configuración del módulo.</p>
      `,
      code: {
        lang: "typescript",
        label: "auth.module.ts — JwtModule asíncrono",
        content: `<span class="kw">import</span> { JwtModule } <span class="kw">from</span> <span class="str">'@nestjs/jwt'</span>;
<span class="kw">import</span> { PassportModule } <span class="kw">from</span> <span class="str">'@nestjs/passport'</span>;

<span class="dec">@Module</span>({
  imports: [
    PassportModule.register({ defaultStrategy: <span class="str">'jwt'</span> }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: <span class="tp">ConfigService</span>) => ({
        secret: configService.get(<span class="str">'JWT_SECRET'</span>),
        signOptions: { expiresIn: <span class="str">'2h'</span> },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
<span class="kw">export class</span> <span class="tp">AuthModule</span> {}`
      }
    },
    {
      heading: "Rutas privadas — Auth Guard",
      body: `
<p>Para proteger una ruta basta con agregar <code>@UseGuards(AuthGuard())</code>. Passport valida el JWT automáticamente. Si falla, NestJS devuelve 401 sin llegar al handler.</p>
<p>El usuario validado por <code>JwtStrategy.validate()</code> queda disponible en <code>req.user</code>. Se accede con <code>@Req()</code> o con un <strong>custom decorator</strong>.</p>
      `,
      code: {
        lang: "typescript",
        label: "Ruta privada + GetUser decorator",
        content: `<span class="cm">// auth.controller.ts</span>
<span class="kw">import</span> { UseGuards } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">import</span> { AuthGuard } <span class="kw">from</span> <span class="str">'@nestjs/passport'</span>;

<span class="dec">@Get</span>(<span class="str">'private'</span>)
<span class="dec">@UseGuards</span>(AuthGuard())
getPrivateRoute(<span class="dec">@Req</span>() req: <span class="tp">Request</span>) {
  <span class="kw">return</span> req.user;
}

<span class="cm">// decorators/get-user.decorator.ts — forma limpia</span>
<span class="kw">import</span> { createParamDecorator, ExecutionContext } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;

<span class="kw">export const</span> GetUser = createParamDecorator(
  (data: <span class="tp">string</span>, ctx: <span class="tp">ExecutionContext</span>) => {
    <span class="kw">const</span> user = ctx.switchToHttp().getRequest().user;
    <span class="kw">return</span> data ? user[data] : user;
  },
);

<span class="cm">// Uso en el controlador</span>
<span class="dec">@Get</span>(<span class="str">'private'</span>)
<span class="dec">@UseGuards</span>(AuthGuard())
getPrivateRoute(<span class="dec">@GetUser</span>() user: <span class="tp">User</span>) {
  <span class="kw">return</span> user;
}`
      }
    },
    {
      heading: "Control de roles — Guard + Decorator compuesto",
      body: `
<p>Para verificar roles se combina un <strong>custom decorator</strong> que define los roles requeridos con un <strong>custom guard</strong> que los lee y los compara contra los roles del usuario autenticado.</p>
<p>La composición de decoradores con <code>applyDecorators</code> permite crear un único <code>@Auth('admin')</code> que aplica el AuthGuard y el RoleGuard juntos.</p>
      `,
      code: {
        lang: "typescript",
        label: "role-protected.decorator.ts + user-role.guard.ts + auth.decorator.ts",
        content: `<span class="cm">// role-protected.decorator.ts</span>
<span class="kw">import</span> { SetMetadata } <span class="kw">from</span> <span class="str">'@nestjs/common'</span>;
<span class="kw">export const</span> META_ROLES = <span class="str">'roles'</span>;
<span class="kw">export const</span> RoleProtected = (...roles: <span class="tp">ValidRoles</span>[]) =>
  SetMetadata(META_ROLES, roles);

<span class="cm">// user-role.guard.ts</span>
<span class="dec">@Injectable</span>()
<span class="kw">export class</span> <span class="tp">UserRoleGuard</span> <span class="kw">implements</span> <span class="tp">CanActivate</span> {
  canActivate(ctx: <span class="tp">ExecutionContext</span>): <span class="tp">boolean</span> {
    <span class="kw">const</span> validRoles = <span class="kw">this</span>.reflector.get&lt;<span class="tp">string</span>[]&gt;(META_ROLES, ctx.getHandler());
    <span class="kw">if</span> (!validRoles?.length) <span class="kw">return true</span>;
    <span class="kw">const</span> user: <span class="tp">User</span> = ctx.switchToHttp().getRequest().user;
    <span class="kw">if</span> (!user) <span class="kw">throw new</span> <span class="tp">BadRequestException</span>(<span class="str">'User not found'</span>);
    <span class="kw">if</span> (user.roles.some(r => validRoles.includes(r))) <span class="kw">return true</span>;
    <span class="kw">throw new</span> <span class="tp">ForbiddenException</span>(<span class="str">\`Usuario \${user.email} necesita rol: \${validRoles}\`</span>);
  }
}

<span class="cm">// auth.decorator.ts — composición</span>
<span class="kw">export const</span> Auth = (...roles: <span class="tp">ValidRoles</span>[]) =>
  applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );`
      },
      callout: { title: "Uso final", text: "@Auth('admin') sobre cualquier handler: autentica con JWT Y verifica el rol en una sola línea." }
    },
    {
      heading: "Auth en otros módulos y usuario que creó el producto",
      body: `
<p>Para usar el AuthModule en otro módulo (ej: ProductsModule) basta con importarlo. Como <code>AuthModule</code> exporta <code>JwtStrategy</code> y <code>PassportModule</code>, el guard <code>AuthGuard()</code> funciona sin configuración extra.</p>
<p>Para registrar qué usuario creó un producto, se agrega una relación <code>ManyToOne</code> en la entidad Product y se pasa el usuario desde el controlador al servicio.</p>
      `,
      code: {
        lang: "typescript",
        label: "Relación user → product en product.entity.ts",
        content: `<span class="cm">// product.entity.ts</span>
<span class="dec">@ManyToOne</span>(() => User, user => user.product, { eager: <span class="kw">true</span> })
user: <span class="tp">User</span>;

<span class="cm">// products.controller.ts</span>
<span class="dec">@Post</span>()
<span class="dec">@Auth</span>()
create(
  <span class="dec">@Body</span>() createProductDto: <span class="tp">CreateProductDto</span>,
  <span class="dec">@GetUser</span>() user: <span class="tp">User</span>,
) {
  <span class="kw">return this</span>.productsService.create(createProductDto, user);
}`
      }
    }
  ]
};
