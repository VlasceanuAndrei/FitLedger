using FitnessTracker.Api.DTOs;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;using Microsoft.AspNetCore.Authorization;
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
    private readonly IPrimaryAdminService _primaryAdmin;

    public AdminController(UserManager<AppUser> users, IPrimaryAdminService primaryAdmin)
    {
        _users = users;
        _primaryAdmin = primaryAdmin;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserSummaryDto>>> ListUsers(CancellationToken ct)
    {
        var users = await _users.Users.AsNoTracking().OrderBy(u => u.Email).ToListAsync(ct);
        var result = new List<UserSummaryDto>(users.Count);
        foreach (var u in users)
        {
            var roles = await _users.GetRolesAsync(new AppUser { Id = u.Id });
            result.Add(ToDto(u, roles));
        }

        return Ok(result);
    }

    [HttpPut("users/{id:guid}/role")]
    public async Task<ActionResult<UserSummaryDto>> SetUserRole(
        Guid id,
        [FromBody] SetUserRoleRequest request,
        CancellationToken ct)
    {
        var caller = await _users.GetUserAsync(User);
        if (caller == null || !_primaryAdmin.IsPrimaryAdmin(caller))
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { error = "Only the primary administrator can change user roles." });
        }

        var target = await _users.FindByIdAsync(id.ToString());
        if (target == null)
            return NotFound(new { error = "User not found." });

        if (_primaryAdmin.IsPrimaryAdmin(target))
        {
            return BadRequest(new { error = "The primary administrator role cannot be changed." });
        }

        var role = request.Role.Trim();
        if (role != Roles.Admin && role != Roles.User)
            return BadRequest(new { error = "Role must be User or Admin." });

        var current = await _users.GetRolesAsync(target);
        await _users.RemoveFromRolesAsync(target, current);

        var add = await _users.AddToRoleAsync(target, role);
        if (!add.Succeeded)
        {
            return BadRequest(new
            {
                error = string.Join("; ", add.Errors.Select(e => e.Description)),
            });
        }

        var updatedRoles = await _users.GetRolesAsync(target);
        return Ok(ToDto(target, updatedRoles));
    }

    private UserSummaryDto ToDto(AppUser user, IList<string> roles)
    {
        var role = roles.Contains(Roles.Admin) ? Roles.Admin : Roles.User;
        return new UserSummaryDto(
            user.Id,
            user.Email ?? "",
            user.UserName ?? "",
            role,
            _primaryAdmin.IsPrimaryAdmin(user));
    }
}
