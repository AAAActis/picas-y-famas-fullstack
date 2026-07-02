using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PicasYFamas.Data;
using PicasYFamas.Services;
using PicasYFamas.Models; 
using Microsoft.OpenApi;
//using ESCMB.GameCore; // Descomentá esto si lo necesitan acá

var builder = WebApplication.CreateBuilder(args);

// 1. Controladores
builder.Services.AddControllers();

// 2. Base de Datos (SQLite)
builder.Services.AddDbContext<GameDbContext>(options =>
    options.UseSqlite("Data Source=picasyfamas.db"));

// Inyección de Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IGameService, GameService>(); 

// 3. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 4. Autenticación JWT
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

// 5. Swagger con soporte JWT (Sintaxis exclusiva para .NET 10 / Swashbuckle v10+)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "NumberGuessGameApi", Version = "v1" });

    // Definición del esquema
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingresá el token JWT en este formato: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http, // Para Bearer en las versiones nuevas se recomienda Http en lugar de ApiKey
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    // Requisito de seguridad (Usando el delegado y OpenApiSecuritySchemeReference)
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

// IMPORTANTE: El orden del pipeline (CORS -> Auth -> Controllers)
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();