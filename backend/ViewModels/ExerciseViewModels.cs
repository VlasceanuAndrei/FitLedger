namespace FitnessTracker.Api.ViewModels;

public sealed record ExerciseDto(int Id, string Name);

public sealed record CreateExerciseRequest(string Name);
