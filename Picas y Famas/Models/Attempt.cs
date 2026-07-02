using System;
using System.ComponentModel.DataAnnotations;

namespace PicasYFamas.Models
{
    public class Attempt
    {
        [Key]
        public int Id { get; set; }
        public int GameId { get; set; }
        [Required, MaxLength(10)]
        public string AttemptedNumber { get; set; } = string.Empty;
        public int Famas { get; set; }
        public int Picas { get; set; }
        [MaxLength(255)]
        public string Message { get; set; } = string.Empty;
        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

        //navegacion
        public virtual Game Game { get; set; } = null!;
    }
}