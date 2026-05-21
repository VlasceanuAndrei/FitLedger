using FitnessTracker.Api.Models;
using FitnessTracker.Api.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace FitnessTracker.Api.Services;

public sealed class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IJwtTokenService _jwt;

    public AuthService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtTokenService jwt)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwt = jwt;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        var userName = request.UserName.Trim();
        var email = request.Email.Trim();

        if (string.IsNullOrWhiteSpace(userName))
        {
            throw new InvalidOperationException("Username is required.");
        }

        var existingEmail = await _userManager.FindByEmailAsync(email);
        if (existingEmail != null)
        {
            throw new InvalidOperationException("Email already registered.");
        }

        var existingUserName = await _userManager.FindByNameAsync(userName);
        if (existingUserName != null)
        {
            throw new InvalidOperationException("Username already taken.");
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            UserName = userName,
            Email = email
        };

        var create = await _userManager.CreateAsync(user, request.Password);
        if (!create.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", create.Errors.Select(e => e.Description)));
        }

        await _userManager.AddToRoleAsync(user, Roles.User);

        var token = await _jwt.CreateAccessTokenAsync(user, ct);
        return new AuthResponse(token);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new InvalidOperationException("Invalid credentials.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException("Invalid credentials.");
        }

        var token = await _jwt.CreateAccessTokenAsync(user, ct);
        return new AuthResponse(token);
    }
}

