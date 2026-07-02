using Microsoft.AspNetCore.Mvc;
using PicasYFamas.DateTransferObjects;
using PicasYFamas.Services;

namespace PicasYFamas.Controllers
{
    [ApiController]
    [Route("api/game/v1")]
    public class GameController : ControllerBase
    {
        private readonly IAuthService _authService;

        public GameController(IAuthService authService)
        {
            _authService = authService;
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