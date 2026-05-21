namespace FitnessTracker.Api.ViewModels;

public sealed record ItemDto(Guid Id, string Name, string? Description);

public sealed record CreateItemRequest(string Name, string? Description);

public sealed record UpdateItemRequest(string Name, string? Description);

