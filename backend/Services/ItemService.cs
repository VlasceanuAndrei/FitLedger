using FitnessTracker.Api.Models;
using FitnessTracker.Api.Repositories;
using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public sealed class ItemService : IItemService
{
    private readonly IItemRepository _items;

    public ItemService(IItemRepository items)
    {
        _items = items;
    }

    public async Task<List<ItemDto>> ListAsync(Guid userId, CancellationToken ct)
    {
        var list = await _items.ListForUserAsync(userId, ct);
        return list.Select(ToDto).ToList();
    }

    public async Task<ItemDto> GetAsync(Guid userId, Guid itemId, CancellationToken ct)
    {
        var item = await _items.GetForUserAsync(userId, itemId, ct);
        if (item == null) throw new KeyNotFoundException("Item not found.");
        return ToDto(item);
    }

    public async Task<ItemDto> CreateAsync(Guid userId, CreateItemRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) throw new InvalidOperationException("Name is required.");

        var item = new Item
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            UserId = userId
        };

        await _items.AddAsync(item, ct);
        await _items.SaveChangesAsync(ct);
        return ToDto(item);
    }

    public async Task<ItemDto> UpdateAsync(Guid userId, Guid itemId, UpdateItemRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) throw new InvalidOperationException("Name is required.");

        var item = await _items.GetForUserAsync(userId, itemId, ct);
        if (item == null) throw new KeyNotFoundException("Item not found.");

        item.Name = request.Name.Trim();
        item.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

        await _items.SaveChangesAsync(ct);
        return ToDto(item);
    }

    public async Task DeleteAsync(Guid userId, Guid itemId, CancellationToken ct)
    {
        var item = await _items.GetForUserAsync(userId, itemId, ct);
        if (item == null) throw new KeyNotFoundException("Item not found.");

        _items.Remove(item);
        await _items.SaveChangesAsync(ct);
    }

    private static ItemDto ToDto(Item x) => new(x.Id, x.Name, x.Description);
}

