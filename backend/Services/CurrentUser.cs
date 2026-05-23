using System.Security.Claims;

namespace FitnessTracker.Api.Services;

public static class CurrentUser
{
    public static Guid GetUserId(ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (raw == null || !Guid.TryParse(raw, out var id))
        {
            throw new InvalidOperationException("Missing user id claim.");
        }

        return id;
    }
}

