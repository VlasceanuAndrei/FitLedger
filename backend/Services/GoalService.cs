using FitnessTracker.Api.Models;
using FitnessTracker.Api.Repositories;
using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public sealed class GoalService : IGoalService
{
    private readonly IGoalRepository _goals;

    public GoalService(IGoalRepository goals)
    {
        _goals = goals;
    }

    public async Task<List<GoalDto>> ListAsync(Guid userId, CancellationToken ct)
    {
        var list = await _goals.ListForUserAsync(userId, ct);
        return list.Select(ToDto).ToList();
    }

    public async Task<GoalDto> GetAsync(Guid userId, int goalId, CancellationToken ct)
    {
        var goal = await _goals.GetForUserAsync(userId, goalId, ct);
        if (goal == null) throw new KeyNotFoundException("Goal not found.");
        return ToDto(goal);
    }

    public async Task<GoalDto> CreateAsync(Guid userId, CreateGoalRequest request, CancellationToken ct)
    {
        var goal = new Goal
        {
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            TargetDateUtc = request.TargetDateUtc,
            CreatedAtUtc = DateTime.UtcNow,
            IsCompleted = false
        };

        await _goals.AddAsync(goal, ct);
        await _goals.SaveChangesAsync(ct);

        return ToDto(goal);
    }

    private static GoalDto ToDto(Goal g) =>
        new(g.Id, g.Title, g.Description, g.CreatedAtUtc, g.TargetDateUtc, g.IsCompleted);
}
