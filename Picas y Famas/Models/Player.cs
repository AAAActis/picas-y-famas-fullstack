using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PicasYFamas.Models
{
    public class Player
    {
        [Key]
        public Guid id {get; set;}
        [Required, MaxLength(50)]
        public string? FirstName {get; set;}
        [Required, MaxLength(50)]
        public string? LastName {get; set;}
        public int Age {get; set;}
        [Required, EmailAddress, MaxLength(100)]
        public string? Email {get; set;}
        [Required]
        public string? PasswordHash {get; set;}
        public DateTime CreatedAt {get; set;} = DateTime.Now;

        //navegacion
        public virtual ICollection<Game> Games {get; set;} = new List<Game>();
    }
}