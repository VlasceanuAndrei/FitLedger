using FitnessTracker.Api.Models;
using FitnessTracker.Api.Repositories;
using FitnessTracker.Api.ViewModels;

namespace FitnessTracker.Api.Services;

public sealed class ProgressService : IProgressService
{
    private readonly IProgressRepository _progress;

    public ProgressService(IProgressRepository progress)
    {
        _progress = progress;
    }

    public async Task<List<ProgressEntryDto>> ListAsync(Guid userId, CancellationToken ct)
    {
        var list = await _progress.ListForUserAsync(userId, ct);
        return list.Select(ToDto).ToList();
    }

    public async Task<ProgressEntryDto> GetAsync(Guid userId, Guid entryId, CancellationToken ct)
    {
        var entry = await _progress.GetForUserAsync(userId, entryId, ct);
        if (entry == null) throw new KeyNotFoundException("Progress entry not found.");
        return ToDto(entry);
    }

    public async Task<ProgressEntryDto> CreateAsync(Guid userId, CreateProgressEntryRequest request, CancellationToken ct)
    {
        var entry = new ProgressEntry
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DateUtc = request.DateUtc,
            Metric = request.Metric,
            Value = request.Value
        };

        await _progress.AddAsync(entry, ct);
        await _progress.SaveChangesAsync(ct);

        return ToDto(entry);
    }

    private static ProgressEntryDto ToDto(ProgressEntry e) =>
        new(e.Id, e.DateUtc, e.Metric, e.Value);
}

