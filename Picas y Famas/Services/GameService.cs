using GameCore;
using Microsoft.EntityFrameworkCore;
using PicasYFamas.Data;
using PicasYFamas.DateTransferObjects;
using PicasYFamas.Models;

namespace PicasYFamas.Services
{
    public class GameService : IGameService
    {
        private readonly GameDbContext _context;

        public GameService(GameDbContext context)
        {
            _context = context;
        }

        public async Task<GuessNumberResponse> GuessAsync(GuessNumberRequest request, Guid playerId)
        {
            // Validar 4 dígitos sin repetir
            if (request.AttemptedNumber.Length != 4 || !request.AttemptedNumber.All(char.IsDigit))
                throw new Exception("El número debe tener exactamente 4 dígitos.");

            if (request.AttemptedNumber.Distinct().Count() != 4)
                throw new Exception("El número no debe tener dígitos repetidos.");

            // Obtener el juego
            var game = await _context.Games
                .FirstOrDefaultAsync(g => g.Id == request.GameId && g.PlayerId == playerId);

            if (game == null)
                throw new KeyNotFoundException($"Juego {request.GameId} no encontrado.");

            if (game.IsFinished)
                return new GuessNumberResponse
                {
                    GameId = game.Id,
                    AttemptedNumber = request.AttemptedNumber,
                    Message = $"El juego {request.GameId} ya ha finalizado."
                };

            // Usar ESCMB.GameCore
            var resultado = Evaluator.ValidateAttempt(game.SecretNumber, request.AttemptedNumber);

            _context.Attempts.Add(new Attempt
            {
                GameId = game.Id,
                AttemptedNumber = request.AttemptedNumber,
                Famas = resultado.Fama,
                Picas = resultado.Pica,
                Message = resultado.Message,
                AttemptedAt = DateTime.UtcNow
            });

            // Si ganó, cerrar el juego
            if (resultado.Fama == 4)
                game.IsFinished = true;

            await _context.SaveChangesAsync();

            return new GuessNumberResponse
            {
                GameId = game.Id,
                AttemptedNumber = request.AttemptedNumber,
                Message = resultado.Message
            };
        }
    }
}