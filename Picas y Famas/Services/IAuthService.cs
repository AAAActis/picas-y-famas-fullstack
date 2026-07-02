using PicasYFamas.DateTransferObjects;

namespace PicasYFamas.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterPlayerRequest request);
        Task<string> LoginAsync(LoginRequest request);
    }
}