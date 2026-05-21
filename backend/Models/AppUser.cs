using Microsoft.AspNetCore.Identity;

namespace FitnessTracker.Api.Models;

public class AppUser : IdentityUser<Guid>
{
    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<ProgressEntry> ProgressEntries { get; set; } = new List<ProgressEntry>();
    public ICollection<Item> Items { get; set; } = new List<Item>();
}

