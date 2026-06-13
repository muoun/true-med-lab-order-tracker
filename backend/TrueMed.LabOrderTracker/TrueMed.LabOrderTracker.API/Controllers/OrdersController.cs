using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TrueMed.LabOrderTracker.API.DTOs;
using TrueMed.LabOrderTracker.API.Services;

namespace TrueMed.LabOrderTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _svc;

        public OrdersController(IOrderService svc)
        {
            _svc = svc;
        }

        // POST /api/orders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
        {
            var (order, errors) = await _svc.CreateAsync(request);

            if (errors != null)
            {
                var errorResponse = new ErrorResponse();
                foreach (var kv in errors)
                    errorResponse.Errors[kv.Key] = kv.Value;
                return BadRequest(errorResponse);
            }

            // 201 Created with location header
            return StatusCode(StatusCodes.Status201Created,order);
        }

        // GET /api/orders?priority=high
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? priority)
        {
            var statOnly = string.Equals(priority, "high", StringComparison.OrdinalIgnoreCase);

            var list = await _svc.ListAsync(statOnly);

            var response = new
            {
                data = list,
                meta = new
                {
                    count = list.Count,
                    filtered = statOnly
                }
            };

            return Ok(response);
        }
    }
}