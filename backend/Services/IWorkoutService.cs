using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public interface IWorkoutService
{
    Task<List<WorkoutDto>> ListAsync(Guid userId, CancellationToken ct);
    Task<WorkoutDto> GetAsync(Guid userId, int workoutId, CancellationToken ct);
    Task<WorkoutDto> CreateAsync(Guid userId, CreateWorkoutRequest request, CancellationToken ct);
    Task<WorkoutDto> UpdateAsync(Guid userId, int workoutId, UpdateWorkoutRequest request, CancellationToken ct);
    Task DeleteAsync(Guid userId, int workoutId, CancellationToken ct);
}
