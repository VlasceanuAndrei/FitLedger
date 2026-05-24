namespace FitnessTracker.Api.ViewModels;

public sealed record CreateProgressEntryRequest(DateTime DateUtc, string Metric, decimal Value);
