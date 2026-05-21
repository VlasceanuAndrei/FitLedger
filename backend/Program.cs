using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<FitnessTracker.Api.Data.AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("Default"));
});

builder.Services
    .AddIdentityCore<FitnessTracker.Api.Models.AppUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<FitnessTracker.Api.Models.AppRole>()
    .AddEntityFrameworkStores<FitnessTracker.Api.Data.AppDbContext>()
    .AddSignInManager();

builder.Services.Configure<FitnessTracker.Api.Services.JwtOptions>(
    builder.Configuration.GetSection(FitnessTracker.Api.Services.JwtOptions.SectionName)
);

var jwt = builder.Configuration.GetSection(FitnessTracker.Api.Services.JwtOptions.SectionName).Get<FitnessTracker.Api.Services.JwtOptions>()
          ?? new FitnessTracker.Api.Services.JwtOptions();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier
        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { error = "Unauthorized" });
            },
            OnForbidden = async context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { error = "Forbidden" });
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<FitnessTracker.Api.Repositories.IWorkoutRepository, FitnessTracker.Api.Repositories.WorkoutRepository>();
builder.Services.AddScoped<FitnessTracker.Api.Repositories.IExerciseRepository, FitnessTracker.Api.Repositories.ExerciseRepository>();
builder.Services.AddScoped<FitnessTracker.Api.Repositories.IGoalRepository, FitnessTracker.Api.Repositories.GoalRepository>();
builder.Services.AddScoped<FitnessTracker.Api.Repositories.IProgressRepository, FitnessTracker.Api.Repositories.ProgressRepository>();
builder.Services.AddScoped<FitnessTracker.Api.Repositories.IItemRepository, FitnessTracker.Api.Repositories.ItemRepository>();

builder.Services.AddScoped<FitnessTracker.Api.Services.IJwtTokenService, FitnessTracker.Api.Services.JwtTokenService>();
builder.Services.AddScoped<FitnessTracker.Api.Services.IAuthService, FitnessTracker.Api.Services.AuthService>();
builder.Services.AddScoped<FitnessTracker.Api.Services.IWorkoutService, FitnessTracker.Api.Services.WorkoutService>();
builder.Services.AddScoped<FitnessTracker.Api.Services.IExerciseService, FitnessTracker.Api.Services.ExerciseService>();
builder.Services.AddScoped<FitnessTracker.Api.Services.IGoalService, FitnessTracker.Api.Services.GoalService>();
builder.Services.AddScoped<FitnessTracker.Api.Services.IProgressService, FitnessTracker.Api.Services.ProgressService>();
builder.Services.AddScoped<FitnessTracker.Api.Services.IItemService, FitnessTracker.Api.Services.ItemService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<FitnessTracker.Api.Services.GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await FitnessTracker.Api.Services.IdentitySeeder.SeedAsync(app.Services, CancellationToken.None);

app.Run();
