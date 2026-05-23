namespace FitnessTracker.Api.ViewModels;

public sealed record ExerciseDto(Guid Id, string Name);

public sealed record CreateExerciseRequest(string Name);

