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

    public async Task<WorkoutDto> GetAsync(Guid userId, Guid workoutId, CancellationToken ct)
    {
        var workout = await _workouts.GetForUserAsync(userId, workoutId, ct);
        if (workout == null) throw new KeyNotFoundException("Workout not found.");
        return ToDto(workout);
    }

    public async Task<WorkoutDto> CreateAsync(Guid userId, CreateWorkoutRequest request, CancellationToken ct)
    {
        var workout = new Workout
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            UserId = userId
        };

        await _workouts.AddAsync(workout, ct);

        if (request.ExerciseIds.Count > 0)
        {
            var exists = await _db.Exercises
                .Where(x => request.ExerciseIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync(ct);

            foreach (var exId in exists)
            {
                workout.WorkoutExercises.Add(new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exId });
            }
        }

        await _workouts.SaveChangesAsync(ct);
        return ToDto(workout);
    }

    public async Task<WorkoutDto> UpdateAsync(Guid userId, Guid workoutId, UpdateWorkoutRequest request, CancellationToken ct)
    {
        var workout = await _workouts.GetForUserAsync(userId, workoutId, ct);
        if (workout == null) throw new KeyNotFoundException("Workout not found.");

        workout.Name = request.Name;

        // Replace exercise links
        workout.WorkoutExercises.Clear();
        if (request.ExerciseIds.Count > 0)
        {
            var exists = await _db.Exercises
                .Where(x => request.ExerciseIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync(ct);

            foreach (var exId in exists)
            {
                workout.WorkoutExercises.Add(new WorkoutExercise { WorkoutId = workout.Id, ExerciseId = exId });
            }
        }

        await _workouts.SaveChangesAsync(ct);
        return ToDto(workout);
    }

    public async Task DeleteAsync(Guid userId, Guid workoutId, CancellationToken ct)
    {
        var workout = await _workouts.GetForUserAsync(userId, workoutId, ct);
        if (workout == null) throw new KeyNotFoundException("Workout not found.");

        _workouts.Remove(workout);
        await _workouts.SaveChangesAsync(ct);
    }

    private static WorkoutDto ToDto(Workout w) =>
        new(w.Id, w.Name, w.WorkoutExercises.Select(x => x.ExerciseId).ToList());
}

