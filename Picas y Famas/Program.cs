using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi; 
using System.Text;
using PicasYFamas.Data;      // Del PR de tu compañero
using PicasYFamas.Services;  // Del PR de tu compañero
using GameCore;            // Del PR de tu compañero

var builder = WebApplication.CreateBuilder(args);

// 1. Controladores
builder.Services.AddControllers();

// 2. Base de Datos (SQLite) - Del PR de tu compañero
builder.Services.AddDbContext<GameDbContext>(options =>
    options.UseSqlite("Data Source=picasyfamas.db"));

// Inyección del AuthService - Del PR de tu compañero
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IGameService, GameService>();

// 3. CORS - Tuyo
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 4. Autenticación JWT - Combinado
var jwtKey = builder.Configuration["Jwt_Key"] ?? builder.Configuration["Jwt:Key"] ?? "ClaveSuperSecretaParaDesarrollo12345!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// 5. Swagger con soporte JWT (Sintaxis para Swashbuckle v10+) - Tuyo
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "NumberGuessGameApi", Version = "v1" });
    
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingresá el token JWT en este formato: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);
    
    // Delegado requerido por la v10+
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 6. Usar CORS antes de la autenticación - Tuyo
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var r = Evaluator.ValidateAttempt("1234", "1234");
var props = r.GetType().GetProperties().Select(p => p.Name);
Console.WriteLine(string.Join(", ", props));

app.Run();