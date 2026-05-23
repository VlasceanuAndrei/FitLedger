using FitnessTracker.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser, AppRole, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutSession> WorkoutSessions => Set<WorkoutSession>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<ProgressEntry> ProgressEntries => Set<ProgressEntry>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Workout>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.HasOne(x => x.User)
                .WithMany(u => u.Workouts)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<WorkoutSession>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Workout)
                .WithMany(w => w.Sessions)
                .HasForeignKey(x => x.WorkoutId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Exercise>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.Name).IsUnique();
        });

        builder.Entity<WorkoutExercise>(e =>
        {
            e.HasKey(x => new { x.WorkoutId, x.ExerciseId });
            e.HasOne(x => x.Workout)
                .WithMany(w => w.WorkoutExercises)
                .HasForeignKey(x => x.WorkoutId);
            e.HasOne(x => x.Exercise)
                .WithMany(ex => ex.WorkoutExercises)
                .HasForeignKey(x => x.ExerciseId);
        });

        builder.Entity<Goal>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(200).IsRequired();
            e.HasOne(x => x.User)
                .WithMany(u => u.Goals)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ProgressEntry>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Metric).HasMaxLength(100).IsRequired();
            e.HasOne(x => x.User)
                .WithMany(u => u.ProgressEntries)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

