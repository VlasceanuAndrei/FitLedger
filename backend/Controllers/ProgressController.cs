using FitnessTracker.Api.DTOs;
using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProgressController : ControllerBase
{
    private readonly IProgressService _progress;

    public ProgressController(IProgressService progress)
    {
        _progress = progress;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProgressEntryDto>>> List(CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        return Ok(await _progress.ListAsync(userId, ct));
    }

    [HttpPost]
    public async Task<ActionResult<ProgressEntryDto>> Create([FromBody] CreateProgressEntryRequest request, CancellationToken ct)
    {
        var userId = CurrentUser.GetUserId(User);
        var created = await _progress.CreateAsync(userId, request, ct);
        return Created(string.Empty, created);
    }
}
