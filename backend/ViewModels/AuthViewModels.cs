namespace FitnessTracker.Api.ViewModels;

public sealed record RegisterRequest(string UserName, string Email, string Password);

public sealed record LoginRequest(string Email, string Password);
