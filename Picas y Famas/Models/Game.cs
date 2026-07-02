using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using PicasYFamas.Models;

namespace PicasYFamas.Models
{
    public class Game
    {
        [Key]
        public int Id;
        public Guid PlayerId {get; set;}
        [Required, MaxLength(10)]
        public string SecretNumber { get; set; } = string.Empty;    
        public bool IsFinished { get; set; } = false;   
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //estas son propiedades de navegacion
        public virtual Player Player {get; set;} = null!;
        public virtual ICollection<Attempt> Attempts { get; set; } = new List<Attempt>();
    }
}