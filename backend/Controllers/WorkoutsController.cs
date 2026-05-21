using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workouts;

    public WorkoutsController(IWorkoutService workouts)
    {
        _workouts = workouts;
    }

    [HttpGet]
    public async Task<ActionResult<List<WorkoutDto>>> List(CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _workouts.ListAsync(userId, ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WorkoutDto>> Get([FromRoute] Guid id, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _workouts.GetAsync(userId, id, ct));
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutDto>> Create([FromBody] CreateWorkoutRequest request, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        var created = await _workouts.CreateAsync(userId, request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<WorkoutDto>> Update([FromRoute] Guid id, [FromBody] UpdateWorkoutRequest request, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _workouts.UpdateAsync(userId, id, request, ct));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        await _workouts.DeleteAsync(userId, id, ct);
        return NoContent();
    }
}

