namespace FitnessTracker.Api.Models;

public class WorkoutSession
{
    public Guid Id { get; set; }

    public Guid WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!;

    public DateTime StartedAtUtc { get; set; }
    public DateTime? EndedAtUtc { get; set; }
}

