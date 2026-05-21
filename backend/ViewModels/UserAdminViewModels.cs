namespace FitnessTracker.Api.ViewModels;

public sealed record UserSummaryDto(
    Guid Id,
    string Email,
    string UserName,
    IReadOnlyList<string> Roles);
