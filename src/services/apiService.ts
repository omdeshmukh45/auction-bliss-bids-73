
// Check if the user is authenticated based on local storage token
export function isAuthenticated(): boolean {
  const authToken = localStorage.getItem('auction_auth_token');
  return !!authToken;
}

// Mock API request function
export async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo purposes, return mock data
  // In a real app, this would make an actual API request
  return {} as T;
}
