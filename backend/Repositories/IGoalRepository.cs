using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Repositories;

public interface IGoalRepository
{
    Task<List<Goal>> ListForUserAsync(Guid userId, CancellationToken ct);
    Task<Goal?> GetForUserAsync(Guid userId, Guid goalId, CancellationToken ct);
    Task AddAsync(Goal goal, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

