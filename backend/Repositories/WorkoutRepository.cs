using FitnessTracker.Api.Data;
using FitnessTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Repositories;

public sealed class WorkoutRepository : IWorkoutRepository
{
    private readonly AppDbContext _db;

    public WorkoutRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Workout>> ListForUserAsync(Guid userId, CancellationToken ct) =>
        _db.Workouts
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Include(x => x.WorkoutExercises)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);

    public Task<Workout?> GetForUserAsync(Guid userId, Guid workoutId, CancellationToken ct) =>
        _db.Workouts
            .Where(x => x.UserId == userId && x.Id == workoutId)
            .Include(x => x.WorkoutExercises)
            .FirstOrDefaultAsync(ct);

    public Task AddAsync(Workout workout, CancellationToken ct) =>
        _db.Workouts.AddAsync(workout, ct).AsTask();

    public void Remove(Workout workout) => _db.Workouts.Remove(workout);

    public Task SaveChangesAsync(CancellationToken ct) =>
        _db.SaveChangesAsync(ct);
}

