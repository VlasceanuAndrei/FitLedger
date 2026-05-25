using FitnessTracker.Api.DTOs;
using FitnessTracker.Api.Data;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Repositories;
using FitnessTracker.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services;

public sealed class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _workouts;
    private readonly AppDbContext _db;

    public WorkoutService(IWorkoutRepository workouts, AppDbContext db)
    {
        _workouts = workouts;
        _db = db;
    }

    public async Task<List<WorkoutDto>> ListAsync(Guid userId, CancellationToken ct)
    {
        var list = await _workouts.ListForUserAsync(userId, ct);
        return list.Select(ToDto).ToList();
    }

    public async Task<WorkoutDto> GetAsync(Guid userId, int workoutId, CancellationToken ct)
    {
        var workout = await _workouts.GetForUserAsync(userId, workoutId, ct);
        if (workout == null) throw new KeyNotFoundException("Workout not found.");
        return ToDto(workout);
    }

    public async Task<WorkoutDto> CreateAsync(Guid userId, CreateWorkoutRequest request, CancellationToken ct)
    {
        var exerciseIds = await ResolveExerciseIdsAsync(request.ExerciseIds, ct);

        var workout = new Workout
        {
            Name = request.Name.Trim(),
            UserId = userId
        };

        await _workouts.AddAsync(workout, ct);

        foreach (var exId in exerciseIds)
        {
            workout.WorkoutExercises.Add(new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exId });
        }

        await _workouts.SaveChangesAsync(ct);
        return ToDto(workout);
    }

    public async Task<WorkoutDto> UpdateAsync(Guid userId, int workoutId, UpdateWorkoutRequest request, CancellationToken ct)
    {
        var workout = await _workouts.GetForUserAsync(userId, workoutId, ct);
        if (workout == null) throw new KeyNotFoundException("Workout not found.");

        var exerciseIds = await ResolveExerciseIdsAsync(request.ExerciseIds, ct);

        workout.Name = request.Name.Trim();

        workout.WorkoutExercises.Clear();
        foreach (var exId in exerciseIds)
        {
            workout.WorkoutExercises.Add(new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exId });
        }

        await _workouts.SaveChangesAsync(ct);
        return ToDto(workout);
    }

    public async Task DeleteAsync(Guid userId, int workoutId, CancellationToken ct)
    {
        var workout = await _workouts.GetForUserAsync(userId, workoutId, ct);
        if (workout == null) throw new KeyNotFoundException("Workout not found.");

        _workouts.Remove(workout);
        await _workouts.SaveChangesAsync(ct);
    }

    private async Task<List<int>> ResolveExerciseIdsAsync(IReadOnlyList<int> requested, CancellationToken ct)
    {
        var wanted = requested.Distinct().ToList();
        if (wanted.Count == 0) return wanted;

        var found = await _db.Exercises
            .Where(x => wanted.Contains(x.Id))
            .Select(x => x.Id)
            .ToListAsync(ct);

        var missing = wanted.Except(found).Order().ToList();
        if (missing.Count > 0)
        {
            var label = missing.Count == 1 ? "exercise" : "exercises";
            throw new InvalidOperationException($"Unknown {label}: {string.Join(", ", missing)}.");
        }

        return wanted;
    }

    private static WorkoutDto ToDto(Workout w) =>
        new(w.Id, w.Name, w.WorkoutExercises.Select(x => x.ExerciseId).ToList());
}
