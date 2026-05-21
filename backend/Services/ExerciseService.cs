using FitnessTracker.Api.Models;
using FitnessTracker.Api.Repositories;
using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public sealed class ExerciseService : IExerciseService
{
    private readonly IExerciseRepository _exercises;

    public ExerciseService(IExerciseRepository exercises)
    {
        _exercises = exercises;
    }

    public async Task<List<ExerciseDto>> ListAsync(CancellationToken ct)
    {
        var list = await _exercises.ListAsync(ct);
        return list.Select(x => new ExerciseDto(x.Id, x.Name)).ToList();
    }

    public async Task<ExerciseDto> GetAsync(Guid id, CancellationToken ct)
    {
        var exercise = await _exercises.GetByIdAsync(id, ct);
        if (exercise == null) throw new KeyNotFoundException("Exercise not found.");
        return new ExerciseDto(exercise.Id, exercise.Name);
    }

    public async Task<ExerciseDto> CreateAsync(CreateExerciseRequest request, CancellationToken ct)
    {
        var name = request.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidOperationException("Name is required.");

        var existing = await _exercises.GetByNameAsync(name, ct);
        if (existing != null) throw new InvalidOperationException("Exercise already exists.");

        var exercise = new Exercise
        {
            Id = Guid.NewGuid(),
            Name = name
        };

        await _exercises.AddAsync(exercise, ct);
        await _exercises.SaveChangesAsync(ct);

        return new ExerciseDto(exercise.Id, exercise.Name);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var exercise = await _exercises.GetByIdAsync(id, ct);
        if (exercise == null) throw new KeyNotFoundException("Exercise not found.");

        if (await _exercises.HasWorkoutLinksAsync(id, ct))
        {
            throw new InvalidOperationException(
                "Cannot delete this exercise because it is assigned to one or more workouts. Edit those workouts and remove the exercise first.");
        }

        _exercises.Remove(exercise);
        await _exercises.SaveChangesAsync(ct);
    }
}

