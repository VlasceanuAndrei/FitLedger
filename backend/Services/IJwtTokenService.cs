using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Services;

public interface IJwtTokenService
{
    Task<string> CreateAccessTokenAsync(AppUser user, CancellationToken ct);
}

