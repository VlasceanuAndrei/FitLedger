using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class GoalsController : ControllerBase
{
    private readonly IGoalService _goals;

    public GoalsController(IGoalService goals)
    {
        _goals = goals;
    }

    [HttpGet]
    public async Task<ActionResult<List<GoalDto>>> List(CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _goals.ListAsync(userId, ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GoalDto>> Get([FromRoute] Guid id, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _goals.GetAsync(userId, id, ct));
    }

    [HttpPost]
    public async Task<ActionResult<GoalDto>> Create([FromBody] CreateGoalRequest request, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        var created = await _goals.CreateAsync(userId, request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }
}

