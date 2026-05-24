using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Validation;

namespace FitnessTracker.Api.ViewModels;

public sealed record CreateProgressEntryRequest(
    [DateWithinYears(FieldLimits.DateRangeYears)]
    DateTime DateUtc,

    [Required]
    [StringLength(FieldLimits.MetricMax, MinimumLength = FieldLimits.MetricMin)]
    string Metric,

    [Range(FieldLimits.ProgressValueMin, FieldLimits.ProgressValueMax)]
    [MaxDecimalPlaces(FieldLimits.ProgressValueDecimals)]
    decimal Value);
