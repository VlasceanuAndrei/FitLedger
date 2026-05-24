namespace FitnessTracker.Api.Validation;

public static class FieldLimits
{
    public const int UserNameMin = 3;
    public const int UserNameMax = 30;
    public const string UserNamePattern = "^[A-Za-z0-9._-]+$";

    public const int EmailMin = 5;
    public const int EmailMax = 254;

    public const int PasswordMin = 8;
    public const int PasswordMax = 128;

    public const int WorkoutNameMin = 2;
    public const int WorkoutNameMax = 100;
    public const int WorkoutExercisesMax = 50;

    public const int GoalTitleMin = 2;
    public const int GoalTitleMax = 100;
    public const int GoalDescriptionMax = 500;

    public const int MetricMin = 2;
    public const int MetricMax = 50;

    public const double ProgressValueMin = 0;
    public const double ProgressValueMax = 10000;
    public const int ProgressValueDecimals = 2;

    public const int ExerciseNameMin = 2;
    public const int ExerciseNameMax = 60;

    public const int DateRangeYears = 5;
}
