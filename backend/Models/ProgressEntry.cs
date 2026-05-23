namespace FitnessTracker.Api.Models;

public class ProgressEntry
{
    public Guid Id { get; set; }
    public DateTime DateUtc { get; set; }

    public string Metric { get; set; } = string.Empty;
    public decimal Value { get; set; }

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;
}

