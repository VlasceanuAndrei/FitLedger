using FitnessTracker.Api.Data;
using FitnessTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Repositories;

public sealed class ExerciseRepository : IExerciseRepository
{
    private readonly AppDbContext _db;

    public ExerciseRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Exercise>> ListAsync(CancellationToken ct) =>
        _db.Exercises.AsNoTracking().OrderBy(x => x.Name).ToListAsync(ct);

    public Task<Exercise?> GetByIdAsync(int id, CancellationToken ct) =>
        _db.Exercises.FirstOrDefaultAsync(x => x.Id == id, ct);

    public Task<Exercise?> GetByNameAsync(string name, CancellationToken ct) =>
        _db.Exercises.FirstOrDefaultAsync(
            x => x.Name.ToLower() == name.ToLower(),
            ct);

    public Task<bool> HasWorkoutLinksAsync(int exerciseId, CancellationToken ct) =>
        _db.WorkoutExercises.AsNoTracking().AnyAsync(x => x.ExerciseId == exerciseId, ct);

    public Task AddAsync(Exercise exercise, CancellationToken ct) =>
        _db.Exercises.AddAsync(exercise, ct).AsTask();

    public void Remove(Exercise exercise) => _db.Exercises.Remove(exercise);

    public Task SaveChangesAsync(CancellationToken ct) =>
        _db.SaveChangesAsync(ct);
}
