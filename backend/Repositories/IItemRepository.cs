using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Repositories;

public interface IItemRepository
{
    Task<List<Item>> ListForUserAsync(Guid userId, CancellationToken ct);
    Task<Item?> GetForUserAsync(Guid userId, Guid itemId, CancellationToken ct);
    Task AddAsync(Item item, CancellationToken ct);
    void Remove(Item item);
    Task SaveChangesAsync(CancellationToken ct);
}

