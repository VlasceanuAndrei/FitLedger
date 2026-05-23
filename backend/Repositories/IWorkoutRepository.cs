using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Repositories;

public interface IWorkoutRepository
{
    Task<List<Workout>> ListForUserAsync(Guid userId, CancellationToken ct);
    Task<Workout?> GetForUserAsync(Guid userId, int workoutId, CancellationToken ct);
    Task AddAsync(Workout workout, CancellationToken ct);
    void Remove(Workout workout);
    Task SaveChangesAsync(CancellationToken ct);
}
