using Microsoft.EntityFrameworkCore;
using PicasYFamas.Models;

namespace PicasYFamas.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Attempt> Attempts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Un Player tiene muchos Games
            modelBuilder.Entity<Game>()
                .HasOne(g => g.Player)
                .WithMany(p => p.Games)
                .HasForeignKey(g => g.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            //Un Game tiene muchos Attempts
            modelBuilder.Entity<Attempt>()
                .HasOne(a => a.Game)
                .WithMany(g => g.Attempts)
                .HasForeignKey(a => a.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            // Asegurar que el Email sea único en la base de datos
            modelBuilder.Entity<Player>()
                .HasIndex(p => p.Email)
                .IsUnique();

            modelBuilder.Entity<Player>().HasKey(p => p.id);
            modelBuilder.Entity<Game>().HasKey(g => g.Id);
            modelBuilder.Entity<Attempt>().HasKey(a => a.Id);
        }
    }
}