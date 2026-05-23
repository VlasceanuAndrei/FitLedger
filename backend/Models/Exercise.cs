namespace FitnessTracker.Api.Models;

public class Exercise
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}

