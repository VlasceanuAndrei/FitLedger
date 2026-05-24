using Microsoft.Extensions.Configuration;

namespace FitnessTracker.Api.Configuration;

public static class SecretsGuard
{
    public const int MinimumJwtKeyLength = 32;

    private static readonly string[] Placeholders = ["CHANGE_ME", "CHANGE_ME_TO_A_LONG_RANDOM_SECRET_KEY"];

    public static void Validate(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"Database connection is not configured. Set DB_NAME, DB_USER and DB_PASSWORD in {DotEnvConfigurationExtensions.FileName} (copy .env.example).");
        }

        var key = configuration[$"{Services.JwtOptions.SectionName}:Key"];

        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException(
                $"JWT signing key is missing. Set JWT_KEY in {DotEnvConfigurationExtensions.FileName} (copy .env.example).");
        }

        if (Placeholders.Any(placeholder => key.Contains(placeholder, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException(
                $"JWT_KEY still holds the example placeholder. Generate a real secret, e.g. `openssl rand -hex 32`.");
        }

        if (key.Length < MinimumJwtKeyLength)
        {
            throw new InvalidOperationException(
                $"JWT_KEY must be at least {MinimumJwtKeyLength} characters long; it is {key.Length}. Generate one with `openssl rand -hex 32`.");
        }

        var adminEmail = configuration["SeedAdmin:Email"];
        var adminPassword = configuration["SeedAdmin:Password"];

        if (string.IsNullOrWhiteSpace(adminEmail) != string.IsNullOrWhiteSpace(adminPassword))
        {
            throw new InvalidOperationException(
                "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set together, or both left empty to skip admin seeding.");
        }
    }
}
