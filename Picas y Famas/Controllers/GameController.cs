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

        [AllowAnonymous]
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

        [AllowAnonymous]
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
            var claimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("playerId")?.Value 
                          ?? User.FindFirst("Id")?.Value;

            if (string.IsNullOrEmpty(claimValue) || !Guid.TryParse(claimValue, out Guid playerId))
            {
                return Unauthorized(new { message = "Token inválido o no contiene el ID del jugador." });
            }

            var activeGames = await _context.Games
                .Where(g => g.PlayerId == playerId && !g.IsFinished)
                .ToListAsync();

            if (activeGames.Any())
            {
                foreach (var activeGame in activeGames)
                {
                    activeGame.IsFinished = true;
                }
                await _context.SaveChangesAsync();
            }

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

            return StatusCode(201, new
            {
                gameId = newGame.Id,
                playerId = newGame.PlayerId,
                createdAt = newGame.CreatedAt
            });
        }

        [HttpPost("guess")]
        public async Task<IActionResult> SubmitGuess([FromBody] GuessNumberRequest request)
        {
            try
            {
                var claimValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                              ?? User.FindFirst("playerId")?.Value 
                              ?? User.FindFirst("Id")?.Value;

                if (string.IsNullOrEmpty(claimValue) || !Guid.TryParse(claimValue, out Guid playerId))
                {
                    return Unauthorized(new { message = "Token inválido." });
                }

                var game = await _context.Games
                    .FirstOrDefaultAsync(g => g.PlayerId == playerId && !g.IsFinished);

                if (game == null) 
                {
                    return NotFound(new { message = "No tenés ninguna partida activa. Iniciá una nueva." });
                }

                if (string.IsNullOrEmpty(request.AttemptedNumber) || request.AttemptedNumber.Length != 4 || request.AttemptedNumber.Distinct().Count() != 4)
                {
                    return BadRequest(new { message = "El intento debe tener exactamente 4 dígitos distintos." });
                }

                int famas = 0;
                int picas = 0;

                for (int i = 0; i < 4; i++)
                {
                    if (request.AttemptedNumber[i] == game.SecretNumber[i])
                    {
                        famas++;
                    }
                    else if (game.SecretNumber.Contains(request.AttemptedNumber[i]))
                    {
                        picas++;
                    }
                }

                bool isWin = famas == 4;
                string msg = isWin ? "¡Código descifrado! Ganaste." : $"Famas: {famas} | Picas: {picas}";

                if (isWin)
                {
                    game.IsFinished = true;
                }

                var attempt = new Attempt
                {
                    GameId = game.Id,
                    AttemptedNumber = request.AttemptedNumber,
                    Famas = famas,
                    Picas = picas,
                    Message = msg,
                    AttemptedAt = DateTime.UtcNow
                };

                _context.Attempts.Add(attempt);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    gameId = game.Id,
                    attemptedNumber = request.AttemptedNumber,
                    message = msg,
                    famas = attempt.Famas,
                    picas = attempt.Picas,
                    isFinished = game.IsFinished
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor.", error = ex.Message });
            }
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