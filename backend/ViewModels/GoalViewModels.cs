namespace FitnessTracker.Api.ViewModels;

public sealed record CreateGoalRequest(string Title, string? Description, DateTime? TargetDateUtc);

public sealed record SetGoalCompletedRequest(bool IsCompleted);
