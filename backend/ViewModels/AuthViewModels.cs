using System.ComponentModel.DataAnnotations;
using FitnessTracker.Api.Validation;

namespace FitnessTracker.Api.ViewModels;

public sealed record RegisterRequest(
    [Required]
    [StringLength(FieldLimits.UserNameMax, MinimumLength = FieldLimits.UserNameMin)]
    [RegularExpression(
        FieldLimits.UserNamePattern,
        ErrorMessage = "Username may contain only letters, digits, dots, underscores and hyphens.")]
    string UserName,

    [Required]
    [EmailAddress]
    [StringLength(FieldLimits.EmailMax, MinimumLength = FieldLimits.EmailMin)]
    string Email,

    [Required]
    [StringLength(FieldLimits.PasswordMax, MinimumLength = FieldLimits.PasswordMin)]
    string Password);

public sealed record LoginRequest(
    [Required]
    [StringLength(FieldLimits.EmailMax)]
    string Email,

    [Required]
    [StringLength(FieldLimits.PasswordMax)]
    string Password);
