namespace FitnessTracker.Api.DTOs;

public sealed record AuthResponse(string AccessToken);

public sealed record AuthMeResponse(
    string? UserId,
    string? Email,
    string? UserName,
    IReadOnlyList<string> Roles,
    bool CanManageRoles);
