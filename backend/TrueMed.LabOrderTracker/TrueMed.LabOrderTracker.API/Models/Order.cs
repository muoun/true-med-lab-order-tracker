using System;

namespace TrueMed.LabOrderTracker.API.Models
{
    public enum TestType
    {
        CBC,
        BMP,
        LipidPanel,
        UA
    }

    public enum Priority
    {
        Routine,
        STAT
    }

    public class Order
    {
        public int Id { get; set; }
        public string PatientName { get; set; }  = null!;
        public TestType TestType { get; set; }
        public Priority Priority { get; set; }
        public DateTime CollectionDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}