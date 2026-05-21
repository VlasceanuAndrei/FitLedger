using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ItemsController : ControllerBase
{
    private readonly IItemService _items;

    public ItemsController(IItemService items)
    {
        _items = items;
    }

    [HttpGet]
    public async Task<ActionResult<List<ItemDto>>> List(CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _items.ListAsync(userId, ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ItemDto>> Get([FromRoute] Guid id, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _items.GetAsync(userId, id, ct));
    }

    [HttpPost]
    public async Task<ActionResult<ItemDto>> Create([FromBody] CreateItemRequest request, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        var created = await _items.CreateAsync(userId, request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateItemRequest request, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        await _items.UpdateAsync(userId, id, request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        await _items.DeleteAsync(userId, id, ct);
        return NoContent();
    }
}

