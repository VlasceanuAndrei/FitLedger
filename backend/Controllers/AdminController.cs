using FitnessTracker.Api.Models;
using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Admin)]
public sealed class AdminController : ControllerBase
{
    private readonly UserManager<AppUser> _users;

    public AdminController(UserManager<AppUser> users)
    {
        _users = users;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserSummaryDto>>> ListUsers(CancellationToken ct)
    {
        var users = await _users.Users.AsNoTracking().OrderBy(u => u.Email).ToListAsync(ct);
        var result = new List<UserSummaryDto>(users.Count);
        foreach (var u in users)
        {
            var roles = await _users.GetRolesAsync(new AppUser { Id = u.Id });
            result.Add(new UserSummaryDto(
                u.Id,
                u.Email ?? "",
                u.UserName ?? "",
                roles.OrderBy(r => r).ToArray()));
        }

        return Ok(result);
    }
}
