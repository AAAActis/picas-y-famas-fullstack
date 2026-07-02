using Microsoft.AspNetCore.Mvc;
using PicasYFamas.DateTransferObjects;
using PicasYFamas.Services;
using Microsoft.AspNetCore.Authorization;

namespace PicasYFamas.Controllers
{
    [ApiController]
    [Route("api/game/v1")]
    public class GameController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IGameService _gameService;

        public GameController(IAuthService authService, IGameService gameService)
        {
            _authService = authService;
            _gameService = gameService;
        }

        [HttpPost("guess")]
        public async Task<IActionResult> Guess([FromBody] GuessNumberRequest request)
        {
            try
            {
                var playerIdClaim = User.FindFirst("playerId")?.Value;
                if (playerIdClaim == null) return Unauthorized();

                var playerId = Guid.Parse(playerIdClaim);
                var response = await _gameService.GuessAsync(request, playerId);
                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

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
    }
}