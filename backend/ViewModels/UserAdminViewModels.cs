using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.ViewModels;

public sealed record SetUserRoleRequest(
    [Required]
    string Role);
