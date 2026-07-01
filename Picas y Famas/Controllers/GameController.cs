using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PicasYFamas.Data;
using PicasYFamas.DateTransferObjects;
using PicasYFamas.Models;
using PicasYFamas.Services;

namespace PicasYFamas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/game/v1")]
    public class GameController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly GameDbContext _context;

        public GameController(IAuthService authService, GameDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [AllowAnonymous] //permite entrar sin token para registrarse
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterPlayerRequest request)
        {
            try
            {
                var token = await _authService.RegisterAsync(request);
                return Ok(new RegisterPlayerResponse { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous] //permite entrar sin token para loguearse
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _authService.LoginAsync(request);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartGame()
        {
            //extraer el ID del token
            var claimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("playerId")?.Value 
                          ?? User.FindFirst("Id")?.Value;

            if (string.IsNullOrEmpty(claimValue) || !Guid.TryParse(claimValue, out Guid playerId))
            {
                return Unauthorized(new { message = "Token inválido o no contiene el ID del jugador." });
            }

            // Verificar si hay juego activo
            var hasActiveGame = await _context.Games
                .AnyAsync(g => g.PlayerId == playerId && !g.IsFinished);

            if (hasActiveGame)
            {
                return BadRequest(new { message = "Ya tenés una partida en curso. Debés terminarla antes de empezar otra." });
            }

            // Generar número e instanciar
            string secretNumber = GenerateSecretNumber();

            var newGame = new Game
            {
                PlayerId = playerId,
                SecretNumber = secretNumber,
                IsFinished = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Games.Add(newGame);
            await _context.SaveChangesAsync();

            // Devolver DTO anónimo con lo solicitado
            return StatusCode(201, new
            {
                gameId = newGame.Id,
                playerId = newGame.PlayerId,
                createdAt = newGame.CreatedAt
            });
        }

        private string GenerateSecretNumber()
        {
            var digits = Enumerable.Range(0, 10)
                .OrderBy(_ => Guid.NewGuid())
                .Take(4)
                .ToList();

            if (digits[0] == 0)
            {
                int temp = digits[0];
                digits[0] = digits[1];
                digits[1] = temp;
            }

            return string.Join("", digits);
        }
    
    }
}