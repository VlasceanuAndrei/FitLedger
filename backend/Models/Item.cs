namespace FitnessTracker.Api.Models;

public sealed class Item
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;
}

