using System;

namespace TrueMed.LabOrderTracker.API.DTOs
{
    public class CreateOrderRequest
    {
        public string? PatientName { get; set; }
        public string? TestType { get; set; }
        public string? Priority { get; set; }
        public DateTime? CollectionDate { get; set; }
    }
}