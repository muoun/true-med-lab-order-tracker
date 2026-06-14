using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TrueMed.LabOrderTracker.API.Data;
using TrueMed.LabOrderTracker.API.Models;

namespace TrueMed.LabOrderTracker.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrdersDbContext _db;

        public OrderRepository(OrdersDbContext db)
        {
            _db = db;
        }

        public async Task<Order> AddAsync(Order order)
        {
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            return order;
        }

        public async Task<IReadOnlyList<Order>> ListAsync(Models.Priority? priority = null)
        {
            var query = _db.Orders
                .AsNoTracking()
                .AsQueryable();

            if (priority.HasValue)
            {
                query = query.Where(o => o.Priority == priority.Value);
            }

            return await query.OrderByDescending(o => o.CollectionDate).ToListAsync();
        }
    }
}