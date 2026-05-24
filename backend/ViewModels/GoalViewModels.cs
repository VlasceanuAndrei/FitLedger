using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Validation;

namespace FitnessTracker.Api.ViewModels;

public sealed record CreateGoalRequest(
    [Required]
    [StringLength(FieldLimits.GoalTitleMax, MinimumLength = FieldLimits.GoalTitleMin)]
    string Title,

    [StringLength(FieldLimits.GoalDescriptionMax)]
    string? Description,

    [DateWithinYears(FieldLimits.DateRangeYears)]
    DateTime? TargetDateUtc);

public sealed record SetGoalCompletedRequest(bool IsCompleted);
