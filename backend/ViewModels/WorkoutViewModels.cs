namespace FitnessTracker.Api.ViewModels;

public sealed record WorkoutDto(Guid Id, string Name, IReadOnlyList<Guid> ExerciseIds);

public sealed record CreateWorkoutRequest(string Name, IReadOnlyList<Guid> ExerciseIds);

public sealed record UpdateWorkoutRequest(string Name, IReadOnlyList<Guid> ExerciseIds);

