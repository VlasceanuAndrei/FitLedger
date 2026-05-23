namespace FitnessTracker.Api.ViewModels;

public sealed record WorkoutDto(int Id, string Name, IReadOnlyList<int> ExerciseIds);

public sealed record CreateWorkoutRequest(string Name, IReadOnlyList<int> ExerciseIds);

public sealed record UpdateWorkoutRequest(string Name, IReadOnlyList<int> ExerciseIds);
