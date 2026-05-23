using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Repositories;

public interface IExerciseRepository
{
    Task<List<Exercise>> ListAsync(CancellationToken ct);
    Task<Exercise?> GetByIdAsync(int id, CancellationToken ct);
    Task<Exercise?> GetByNameAsync(string name, CancellationToken ct);
    Task<bool> HasWorkoutLinksAsync(int exerciseId, CancellationToken ct);
    Task AddAsync(Exercise exercise, CancellationToken ct);
    void Remove(Exercise exercise);
    Task SaveChangesAsync(CancellationToken ct);
}
