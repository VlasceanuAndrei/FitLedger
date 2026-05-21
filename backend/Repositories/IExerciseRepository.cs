using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Repositories;

public interface IExerciseRepository
{
    Task<List<Exercise>> ListAsync(CancellationToken ct);
    Task<Exercise?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Exercise?> GetByNameAsync(string name, CancellationToken ct);
    Task<bool> HasWorkoutLinksAsync(Guid exerciseId, CancellationToken ct);
    Task AddAsync(Exercise exercise, CancellationToken ct);
    void Remove(Exercise exercise);
    Task SaveChangesAsync(CancellationToken ct);
}

