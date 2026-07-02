using System.ComponentModel.DataAnnotations;

namespace PicasYFamas.DateTransferObjects
{
    public class GuessNumberRequest
    {
        [Required]
        public int GameId { get; set; }
        [Required]
        public string AttemptedNumber { get; set; } = string.Empty;
    }
}