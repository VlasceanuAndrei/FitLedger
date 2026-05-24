namespace FitnessTracker.Api.DTOs;

public sealed record GoalDto(
    int Id,
    string Title,
    string? Description,
    DateTime CreatedAtUtc,
    DateTime? TargetDateUtc,
    bool IsCompleted);
