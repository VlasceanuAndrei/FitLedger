using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class MaxDecimalPlacesAttribute : ValidationAttribute
{
    public MaxDecimalPlacesAttribute(int places)
    {
        Places = places;
    }

    public int Places { get; }

    public override bool IsValid(object? value)
        => value is not decimal number || decimal.Round(number, Places) == number;

    public override string FormatErrorMessage(string name)
        => $"The {name} field must have at most {Places} decimal places.";
}
