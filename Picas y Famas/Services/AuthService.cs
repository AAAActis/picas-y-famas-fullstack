using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PicasYFamas.Data;
using PicasYFamas.DateTransferObjects;
using PicasYFamas.Models;

namespace PicasYFamas.Services
{
    public class AuthService : IAuthService
    {
        private readonly GameDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(GameDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> RegisterAsync(RegisterPlayerRequest request)
        {
            if (await _context.Players.AnyAsync(p => p.Email == request.Email))
            {
                throw new Exception("El usuario ya existe.");
            }

            var player = new Player
            {
                id = Guid.NewGuid(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Age = request.Age,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.Now
            };
            
            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            
            return GenerateJwtToken(player);
        }

        public async Task<string> LoginAsync(LoginRequest request)
        {
            var player = await _context.Players
                .FirstOrDefaultAsync(p => p.Email == request.Email);
                
            if (player == null)
            {
                throw new Exception("Credenciales inválidas.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, player.PasswordHash))
            {
                throw new Exception("Credenciales inválidas.");
            }

            return GenerateJwtToken(player);
        }

        private string GenerateJwtToken(Player player)
        {
            // Corrección: fallback seguro para evitar que reciba null y explote
            var jwtKey = _configuration["Jwt_Key"] ?? _configuration["Jwt:Key"] ?? "ClaveSuperSecretaParaDesarrollo12345!";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("playerId", player.id.ToString()),
                new Claim(ClaimTypes.Email, player.Email!)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}