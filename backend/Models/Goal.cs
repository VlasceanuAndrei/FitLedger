namespace FitnessTracker.Api.Models;

public class Goal
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; }
    public DateTime? TargetDateUtc { get; set; }
    public bool IsCompleted { get; set; }
}

