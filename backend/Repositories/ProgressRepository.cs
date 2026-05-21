using FitnessTracker.Api.Data;
using FitnessTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Repositories;

public sealed class ProgressRepository : IProgressRepository
{
    private readonly AppDbContext _db;

    public ProgressRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<ProgressEntry>> ListForUserAsync(Guid userId, CancellationToken ct) =>
        _db.ProgressEntries
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.DateUtc)
            .ToListAsync(ct);

    public Task<ProgressEntry?> GetForUserAsync(Guid userId, Guid entryId, CancellationToken ct) =>
        _db.ProgressEntries.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == entryId, ct);

    public Task AddAsync(ProgressEntry entry, CancellationToken ct) =>
        _db.ProgressEntries.AddAsync(entry, ct).AsTask();

    public Task SaveChangesAsync(CancellationToken ct) =>
        _db.SaveChangesAsync(ct);
}

