using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TrueMed.LabOrderTracker.API.DTOs;
using TrueMed.LabOrderTracker.API.Models;
using TrueMed.LabOrderTracker.API.Repositories;

namespace TrueMed.LabOrderTracker.API.Services
{
    public class OrderService : IOrderService
    {
        private static readonly HashSet<string> AllowedTests =
            new(StringComparer.OrdinalIgnoreCase) { "CBC", "BMP", "Lipid Panel", "LipidPanel", "UA" };

        private static readonly HashSet<string> AllowedPriorities =
            new(StringComparer.OrdinalIgnoreCase) { "Routine", "STAT" };

        private readonly IOrderRepository _repo;

        public OrderService(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<(OrderResponse? Order, Dictionary<string, string[]>? Errors)> CreateAsync(CreateOrderRequest request)
        {
            var errors = Validate(request);
            if (errors.Any())
                return (null, errors);

            // Map test type (normalize "Lipid Panel" to enum name)
            var testTypeNormalized = request.TestType!.Replace(" ", "", StringComparison.OrdinalIgnoreCase);
            if (string.Equals(testTypeNormalized, "LipidPanel", StringComparison.OrdinalIgnoreCase))
                testTypeNormalized = "LipidPanel";

            TestType testType = testTypeNormalized.ToUpperInvariant() switch
            {
                "CBC" => TestType.CBC,
                "BMP" => TestType.BMP,
                "LIPIDPANEL" => TestType.LipidPanel,
                "UA" => TestType.UA,
                _ => throw new InvalidOperationException("Unexpected test type") // should not happen due to validation
            };

            Priority priority = string.Equals(request.Priority, "STAT", StringComparison.OrdinalIgnoreCase)
                ? Priority.STAT
                : Priority.Routine;

            var now = DateTime.UtcNow;

            var order = new Order
            {
                PatientName = request.PatientName!.Trim(),
                TestType = testType,
                Priority = priority,
                CollectionDate = request.CollectionDate!.Value.ToUniversalTime(),
                CreatedAt = now
            };

            var created = await _repo.AddAsync(order);

            var response = new OrderResponse
            {
                Id = created.Id,
                PatientName = created.PatientName,
                TestType = created.TestType switch
                {
                    TestType.LipidPanel => "Lipid Panel",
                    _ => created.TestType.ToString()
                },
                Priority = created.Priority.ToString(),
                CollectionDate = created.CollectionDate,
                CreatedAt = created.CreatedAt
            };

            return (response, null);
        }

        public async Task<IReadOnlyList<OrderResponse>> ListAsync(bool statOnly)
        {
            var list = await _repo.ListAsync();

            if (statOnly)
                list = list.Where(l => l.Priority == Priority.STAT).ToList();

            var mapped = list.Select(o => new OrderResponse
            {
                Id = o.Id,
                PatientName = o.PatientName,
                TestType = o.TestType switch
                {
                    TestType.LipidPanel => "Lipid Panel",
                    _ => o.TestType.ToString()
                },
                Priority = o.Priority.ToString(),
                CollectionDate = o.CollectionDate,
                CreatedAt = o.CreatedAt
            }).ToList();

            return mapped;
        }

        private Dictionary<string, string[]> Validate(CreateOrderRequest request)
        {
            var errors = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase);

            void Add(string key, string msg)
            {
                if (!errors.TryGetValue(key, out var list))
                {
                    list = new List<string>();
                    errors[key] = list;
                }
                list.Add(msg);
            }

            if (request.PatientName == null || string.IsNullOrWhiteSpace(request.PatientName))
                Add("patientName", "Patient name is required.");

            if (string.IsNullOrWhiteSpace(request.TestType))
                Add("testType", "Test type is required.");
            else if (!AllowedTests.Contains(request.TestType.Trim()))
                Add("testType", "Please select a valid test type.");

            if (string.IsNullOrWhiteSpace(request.Priority))
                Add("priority", "Priority is required.");
            else if (!AllowedPriorities.Contains(request.Priority.Trim()))
                Add("priority", "Priority must be either Routine or STAT.");

            if (!request.CollectionDate.HasValue)
            {
                Add("collectionDate", "Collection date is required.");
            }
            else
            {
                if (request.CollectionDate.Value.Date < DateTime.UtcNow.Date)
                {
                    Add("collectionDate", "Collection date cannot be in the past.");
                }
            }

            // Convert to required shape
            return errors.ToDictionary(k => k.Key, k => k.Value.ToArray(), StringComparer.OrdinalIgnoreCase);
        }
    }
}