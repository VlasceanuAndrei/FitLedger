using Microsoft.Extensions.Configuration;

namespace FitnessTracker.Api.Configuration;

public static class DotEnvConfigurationExtensions
{
    public const string FileName = ".env";

    public static IConfigurationBuilder AddDotEnv(this IConfigurationBuilder builder, string startDirectory)
    {
        var values = Read(Locate(startDirectory));

        var settings = new Dictionary<string, string?>();

        var host = Resolve(values, "DB_HOST") ?? "localhost";
        var port = Resolve(values, "DB_PORT") ?? "5433";
        var name = Resolve(values, "DB_NAME");
        var user = Resolve(values, "DB_USER");
        var password = Resolve(values, "DB_PASSWORD");

        if (!string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(user) && !string.IsNullOrWhiteSpace(password))
        {
            settings["ConnectionStrings:Default"] =
                $"Host={host};Port={port};Database={name};Username={user};Password={password}";
        }

        Map(settings, values, "JWT_KEY", "Jwt:Key");
        Map(settings, values, "SEED_ADMIN_EMAIL", "SeedAdmin:Email");
        Map(settings, values, "SEED_ADMIN_PASSWORD", "SeedAdmin:Password");

        return settings.Count == 0 ? builder : builder.AddInMemoryCollection(settings);
    }

    private static string? Locate(string startDirectory)
    {
        var directory = new DirectoryInfo(startDirectory);

        while (directory != null)
        {
            var candidate = Path.Combine(directory.FullName, FileName);
            if (File.Exists(candidate)) return candidate;
            directory = directory.Parent;
        }

        return null;
    }

    private static Dictionary<string, string> Read(string? path)
    {
        var values = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (path == null) return values;

        foreach (var raw in File.ReadLines(path))
        {
            var line = raw.Trim();
            if (line.Length == 0 || line.StartsWith('#')) continue;

            var separator = line.IndexOf('=');
            if (separator <= 0) continue;

            var key = line[..separator].Trim();
            var value = line[(separator + 1)..].Trim();

            if (value.Length >= 2 && (value[0] == '"' || value[0] == '\'') && value[^1] == value[0])
            {
                value = value[1..^1];
            }

            values[key] = value;
        }

        return values;
    }

    private static string? Resolve(Dictionary<string, string> values, string key)
    {
        var fromEnvironment = Environment.GetEnvironmentVariable(key);
        if (!string.IsNullOrWhiteSpace(fromEnvironment)) return fromEnvironment;

        return values.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value) ? value : null;
    }

    private static void Map(Dictionary<string, string?> settings, Dictionary<string, string> values, string key, string configurationKey)
    {
        var value = Resolve(values, key);
        if (value != null) settings[configurationKey] = value;
    }
}
