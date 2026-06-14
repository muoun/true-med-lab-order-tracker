using System.Collections.Generic;
using System.Threading.Tasks;
using TrueMed.LabOrderTracker.API.Models;

namespace TrueMed.LabOrderTracker.API.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> AddAsync(Order order);
        Task<IReadOnlyList<Order>> ListAsync(Models.Priority? priority = null);
    }
}