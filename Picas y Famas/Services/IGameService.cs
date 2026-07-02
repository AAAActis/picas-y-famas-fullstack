using PicasYFamas.DateTransferObjects;

namespace PicasYFamas.Services
{
    public interface IGameService
    {
        Task<GuessNumberResponse> GuessAsync(GuessNumberRequest request, Guid playerId);
    }
}