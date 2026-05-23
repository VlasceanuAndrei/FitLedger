namespace FitnessTracker.Api.ViewModels;

public sealed record ProgressEntryDto(int Id, DateTime DateUtc, string Metric, decimal Value);

public sealed record CreateProgressEntryRequest(DateTime DateUtc, string Metric, decimal Value);
