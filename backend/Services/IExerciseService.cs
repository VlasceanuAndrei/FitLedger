using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public interface IExerciseService
{
    Task<List<ExerciseDto>> ListAsync(CancellationToken ct);
    Task<ExerciseDto> GetAsync(int id, CancellationToken ct);
    Task<ExerciseDto> CreateAsync(CreateExerciseRequest request, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
}
