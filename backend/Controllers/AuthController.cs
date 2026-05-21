using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Services;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly UserManager<AppUser> _users;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService auth, UserManager<AppUser> users, ILogger<AuthController> logger)
    {
        _auth = auth;
        _users = users;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        _logger.LogInformation(
            "Register attempt for {UserName} / {Email}",
            request.UserName,
            request.Email);
        return Ok(await _auth.RegisterAsync(request, ct));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Login attempt for {Email}", request.Email);
        return Ok(await _auth.LoginAsync(request, ct));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<AuthMeResponse>> Me()
    {
        var roleSet = new HashSet<string>(StringComparer.Ordinal);
        foreach (var c in User.FindAll(ClaimTypes.Role))
            roleSet.Add(c.Value);
        foreach (var c in User.FindAll("role"))
            roleSet.Add(c.Value);
        foreach (var claim in User.Claims)
        {
            if (claim.Type.Equals("roles", StringComparison.OrdinalIgnoreCase))
                roleSet.Add(claim.Value);
        }

        var roles = roleSet.OrderBy(r => r).ToList();
        var email =
            User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Email);
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        AppUser? dbUser = null;
        if (!string.IsNullOrEmpty(userId))
            dbUser = await _users.FindByIdAsync(userId);
        var resolvedUserName = dbUser?.UserName;

        return Ok(new AuthMeResponse(userId, email, resolvedUserName, roles));
    }
}

