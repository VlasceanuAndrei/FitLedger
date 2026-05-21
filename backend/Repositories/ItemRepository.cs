using FitnessTracker.Api.Data;
using FitnessTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Repositories;

public sealed class ItemRepository : IItemRepository
{
    private readonly AppDbContext _db;

    public ItemRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Item>> ListForUserAsync(Guid userId, CancellationToken ct) =>
        _db.Items
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);

    public Task<Item?> GetForUserAsync(Guid userId, Guid itemId, CancellationToken ct) =>
        _db.Items
            .Where(x => x.UserId == userId && x.Id == itemId)
            .FirstOrDefaultAsync(ct);

    public Task AddAsync(Item item, CancellationToken ct) =>
        _db.Items.AddAsync(item, ct).AsTask();

    public void Remove(Item item) => _db.Items.Remove(item);

    public Task SaveChangesAsync(CancellationToken ct) =>
        _db.SaveChangesAsync(ct);
}

