using FitnessTracker.Api.Data;
using FitnessTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Repositories;

public sealed class GoalRepository : IGoalRepository
{
    private readonly AppDbContext _db;

    public GoalRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<List<Goal>> ListForUserAsync(Guid userId, CancellationToken ct) =>
        _db.Goals.AsNoTracking().Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAtUtc).ToListAsync(ct);

    public Task<Goal?> GetForUserAsync(Guid userId, Guid goalId, CancellationToken ct) =>
        _db.Goals.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == goalId, ct);

    public Task AddAsync(Goal goal, CancellationToken ct) =>
        _db.Goals.AddAsync(goal, ct).AsTask();

    public Task SaveChangesAsync(CancellationToken ct) =>
        _db.SaveChangesAsync(ct);
}

