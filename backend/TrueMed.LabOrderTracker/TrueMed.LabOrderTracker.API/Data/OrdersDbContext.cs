using Microsoft.EntityFrameworkCore;
using TrueMed.LabOrderTracker.API.Models;

namespace TrueMed.LabOrderTracker.API.Data
{
    public class OrdersDbContext : DbContext
    {
        public OrdersDbContext(DbContextOptions<OrdersDbContext> options) : base(options) { }

        public DbSet<Order> Orders => Set<Order>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.PatientName).IsRequired();
                b.Property(x => x.TestType).IsRequired();
                b.Property(x => x.Priority).IsRequired();
                b.Property(x => x.CollectionDate).IsRequired();
                b.Property(x => x.CreatedAt).IsRequired();
            });
        }
    }
}