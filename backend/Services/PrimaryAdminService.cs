using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Services;

public sealed class PrimaryAdminService : IPrimaryAdminService
{
    private readonly IConfiguration _config;

    public PrimaryAdminService(IConfiguration config)
    {
        _config = config;
    }

    public bool IsPrimaryAdmin(AppUser user)
    {
        var seedEmail = _config["SeedAdmin:Email"]?.Trim();
        if (!string.IsNullOrEmpty(seedEmail))
            return string.Equals(user.Email, seedEmail, StringComparison.OrdinalIgnoreCase);

        return string.Equals(user.UserName, "Admin", StringComparison.Ordinal);
    }
}
