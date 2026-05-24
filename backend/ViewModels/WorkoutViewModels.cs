using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Validation;

namespace FitnessTracker.Api.ViewModels;

public sealed record CreateWorkoutRequest(
    [Required]
    [StringLength(FieldLimits.WorkoutNameMax, MinimumLength = FieldLimits.WorkoutNameMin)]
    string Name,

    [Required]
    [MaxCount(FieldLimits.WorkoutExercisesMax)]
    IReadOnlyList<int> ExerciseIds);

public sealed record UpdateWorkoutRequest(
    [Required]
    [StringLength(FieldLimits.WorkoutNameMax, MinimumLength = FieldLimits.WorkoutNameMin)]
    string Name,

    [Required]
    [MaxCount(FieldLimits.WorkoutExercisesMax)]
    IReadOnlyList<int> ExerciseIds);
