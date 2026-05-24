using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public sealed class MaxCountAttribute : ValidationAttribute
{
    public MaxCountAttribute(int count)
    {
        Count = count;
    }

    public int Count { get; }

    public override bool IsValid(object? value)
    {
        if (value is null) return true;
        if (value is ICollection collection) return collection.Count <= Count;
        if (value is not IEnumerable items) return true;

        var seen = 0;
        foreach (var _ in items)
        {
            if (++seen > Count) return false;
        }

        return true;
    }

    public override string FormatErrorMessage(string name)
        => $"The {name} field must contain at most {Count} items.";
}
