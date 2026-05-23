using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public interface IProgressService
{
    Task<List<ProgressEntryDto>> ListAsync(Guid userId, CancellationToken ct);
    Task<ProgressEntryDto> GetAsync(Guid userId, int entryId, CancellationToken ct);
    Task<ProgressEntryDto> CreateAsync(Guid userId, CreateProgressEntryRequest request, CancellationToken ct);
}
