namespace FitnessTracker.Api.ViewModels;

public sealed record ProgressEntryDto(Guid Id, DateTime DateUtc, string Metric, decimal Value);

public sealed record CreateProgressEntryRequest(DateTime DateUtc, string Metric, decimal Value);

