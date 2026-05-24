using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Validation;

namespace FitnessTracker.Api.ViewModels;

public sealed record CreateExerciseRequest(
    [Required]
    [StringLength(FieldLimits.ExerciseNameMax, MinimumLength = FieldLimits.ExerciseNameMin)]
    string Name);
