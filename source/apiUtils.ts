// Utility file for API operations

// Utility function for deep cloning
export function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Secure expression validator - replaced dangerous eval
export function validateExpression(expression: string): boolean {
  // Only allow simple mathematical expressions with numbers and basic operators
  const safePattern = /^[0-9+\-*/().\s]+$/;
  return safePattern.test(expression);
}

// Improved date formatting with consistent error handling
export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  } catch (error) {
    // Removed console.error to avoid code smell
    throw new Error('Invalid date format');
  }
}

// Temperature calculation utilities
export function calculateAverageTemperature(temperatures: number[]): number {
  if (temperatures.length === 0) return 0;
  const sum = temperatures.reduce((acc, curr) => acc + curr, 0);
  return sum / temperatures.length;
}

export function calculateMedianTemperature(temperatures: number[]): number {
  if (temperatures.length === 0) return 0;
  
  // Sort temperatures
  const sorted = [...temperatures].sort((a, b) => a - b);
  
  // Calculate median
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

// Secure configuration management - using environment variables
export function getApiConfiguration(): { key: string | null, secret: string | null } {
  // Use environment variables instead of hardcoded credentials
  return {
    key: process.env.API_KEY || null,
    secret: process.env.API_SECRET || null
  };
}
