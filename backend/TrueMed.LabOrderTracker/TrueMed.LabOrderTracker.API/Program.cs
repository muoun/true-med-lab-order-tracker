using Microsoft.EntityFrameworkCore;
using TrueMed.LabOrderTracker.API.Data;
using TrueMed.LabOrderTracker.API.Repositories;
using TrueMed.LabOrderTracker.API.Services;
using TrueMed.LabOrderTracker.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",  // Vite React
                "https://localhost:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// DbContext - SQLite file in app directory (default)
var connectionString = builder.Configuration.GetConnectionString("Orders") ?? "Data Source=orders.db";
builder.Services.AddDbContext<OrdersDbContext>(options => options.UseSqlite(connectionString));

// DI - repository and service
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ensure database created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
