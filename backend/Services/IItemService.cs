using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public interface IItemService
{
    Task<List<ItemDto>> ListAsync(Guid userId, CancellationToken ct);
    Task<ItemDto> GetAsync(Guid userId, Guid itemId, CancellationToken ct);
    Task<ItemDto> CreateAsync(Guid userId, CreateItemRequest request, CancellationToken ct);
    Task<ItemDto> UpdateAsync(Guid userId, Guid itemId, UpdateItemRequest request, CancellationToken ct);
    Task DeleteAsync(Guid userId, Guid itemId, CancellationToken ct);
}

