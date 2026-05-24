namespace FitnessTracker.Api.DTOs;

public sealed record WorkoutDto(
    int Id, 
    string Name, 
    IReadOnlyList<int> ExerciseIds);
