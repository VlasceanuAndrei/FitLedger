namespace FitnessTracker.Api.ViewModels;

public sealed record GoalDto(Guid Id, string Title, string? Description, DateTime CreatedAtUtc, DateTime? TargetDateUtc, bool IsCompleted);

public sealed record CreateGoalRequest(string Title, string? Description, DateTime? TargetDateUtc);

