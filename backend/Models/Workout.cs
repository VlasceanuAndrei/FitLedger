namespace FitnessTracker.Api.Models;

public class Workout
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public ICollection<WorkoutSession> Sessions { get; set; } = new List<WorkoutSession>();
    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}
