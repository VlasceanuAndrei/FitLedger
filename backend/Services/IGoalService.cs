using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public interface IGoalService
{
    Task<List<GoalDto>> ListAsync(Guid userId, CancellationToken ct);
    Task<GoalDto> GetAsync(Guid userId, Guid goalId, CancellationToken ct);
    Task<GoalDto> CreateAsync(Guid userId, CreateGoalRequest request, CancellationToken ct);
}

