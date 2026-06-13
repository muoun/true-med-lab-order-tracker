using System.Collections.Generic;
using System.Threading.Tasks;
using TrueMed.LabOrderTracker.API.DTOs;

namespace TrueMed.LabOrderTracker.API.Services
{
    public interface IOrderService
    {
        Task<(OrderResponse? Order, Dictionary<string, string[]>? Errors)> CreateAsync(CreateOrderRequest request);
        Task<IReadOnlyList<OrderResponse>> ListAsync(bool statOnly);
    }
}