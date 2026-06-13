using System.Collections.Generic;

namespace TrueMed.LabOrderTracker.API.DTOs
{
    public class ErrorResponse
    {
        // Consistent shape: errors: { field: [..messages] }
        public Dictionary<string, string[]> Errors { get; set; } = new();
    }
}