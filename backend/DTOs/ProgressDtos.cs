namespace FitnessTracker.Api.DTOs;

public sealed record ProgressEntryDto(int Id, DateTime DateUtc, string Metric, decimal Value);
