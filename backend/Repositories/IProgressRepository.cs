using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Repositories;

public interface IProgressRepository
{
    Task<List<ProgressEntry>> ListForUserAsync(Guid userId, CancellationToken ct);
    Task<ProgressEntry?> GetForUserAsync(Guid userId, Guid entryId, CancellationToken ct);
    Task AddAsync(ProgressEntry entry, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

