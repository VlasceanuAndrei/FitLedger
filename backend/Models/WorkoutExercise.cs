namespace FitnessTracker.Api.Models;

public class WorkoutExercise
{
    public Guid WorkoutId { get; set; }
    public Workout Workout { get; set; } = null!;

    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;
}

