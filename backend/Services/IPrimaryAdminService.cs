using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Services;

public interface IPrimaryAdminService
{
    bool IsPrimaryAdmin(AppUser user);
}
