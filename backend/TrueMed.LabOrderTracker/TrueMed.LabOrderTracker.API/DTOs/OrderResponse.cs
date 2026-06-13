using System;

namespace TrueMed.LabOrderTracker.API.DTOs
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = null!;
        public string TestType { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public DateTime CollectionDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}