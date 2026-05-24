namespace FitnessTracker.Api.DTOs;

public sealed record UserSummaryDto(
    Guid Id,
    string Email,
    string UserName,
    string Role,
    bool IsPrimaryAdmin);
