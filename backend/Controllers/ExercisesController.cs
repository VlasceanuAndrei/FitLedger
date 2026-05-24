using FitnessTracker.Api.DTOs;
using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ExercisesController : ControllerBase
{
    private readonly IExerciseService _exercises;

    public ExercisesController(IExerciseService exercises)
    {
        _exercises = exercises;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ExerciseDto>>> List(CancellationToken ct)
    {
        return Ok(await _exercises.ListAsync(ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExerciseDto>> Get([FromRoute] int id, CancellationToken ct)
    {
        return Ok(await _exercises.GetAsync(id, ct));
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ExerciseDto>> Create([FromBody] CreateExerciseRequest request, CancellationToken ct)
    {
        var created = await _exercises.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken ct)
    {
        await _exercises.DeleteAsync(id, ct);
        return NoContent();
    }
}
