using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class DateWithinYearsAttribute : ValidationAttribute
{
    public DateWithinYearsAttribute(int years)
    {
        Years = years;
    }

    public int Years { get; }

    public override bool IsValid(object? value)
    {
        if (value is null) return true;
        if (value is not DateTime date) return false;

        var now = DateTime.UtcNow;
        return date >= now.AddYears(-Years) && date <= now.AddYears(Years);
    }

    public override string FormatErrorMessage(string name)
        => $"The {name} field must be a date within {Years} years of today.";
}
