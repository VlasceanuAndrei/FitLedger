using FitnessTracker.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FitnessTracker.Api.Services;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider sp, CancellationToken ct)
    {
        using var scope = sp.CreateScope();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var db = scope.ServiceProvider.GetRequiredService<Data.AppDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        await db.Database.MigrateAsync(ct);

        if (!await roleManager.RoleExistsAsync(Roles.Admin))
            await roleManager.CreateAsync(new AppRole { Name = Roles.Admin });

        if (!await roleManager.RoleExistsAsync(Roles.User))
            await roleManager.CreateAsync(new AppRole { Name = Roles.User });

        var adminEmail = config["SeedAdmin:Email"];
        var adminPassword = config["SeedAdmin:Password"];
        if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
        {
            var admin = await userManager.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new AppUser { Id = Guid.NewGuid(), UserName = adminEmail, Email = adminEmail };
                var created = await userManager.CreateAsync(admin, adminPassword);
                if (!created.Succeeded)
                    throw new InvalidOperationException(string.Join("; ", created.Errors.Select(e => e.Description)));
            }

            if (!await userManager.IsInRoleAsync(admin, Roles.Admin))
                await userManager.AddToRoleAsync(admin, Roles.Admin);
        }

        var added = false;
        foreach (var name in ExerciseSeedNames)
        {
            var trimmed = name.Trim();
            if (trimmed.Length == 0) continue;
            var exists = await db.Exercises.AnyAsync(
                e => e.Name.ToLower() == trimmed.ToLower(),
                ct);
            if (exists) continue;
            db.Exercises.Add(new Exercise { Id = Guid.NewGuid(), Name = trimmed });
            added = true;
        }

        if (added) await db.SaveChangesAsync(ct);
    }

    private static readonly string[] ExerciseSeedNames =
    [
        "Push-up",
        "Pull-up",
        "Squat",
        "Deadlift",
        "Bench press",
        "Overhead press",
        "Barbell row",
        "Lat pulldown",
        "Leg press",
        "Lunge",
        "Plank",
        "Burpee",
        "Jumping jack",
        "Mountain climber",
        "Romanian deadlift",
        "Bicep curl",
        "Tricep dip",
        "Lateral raise",
        "Running (treadmill)",
        "Cycling",
    ];
}

