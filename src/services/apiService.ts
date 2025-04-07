
import { toast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/lib/config";

// API base URL - Use configuration value
const API_BASE_URL = API_CONFIG.baseUrl;

// Generic fetch function with error handling
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get the auth token from localStorage if it exists
  const token = localStorage.getItem("auth_token");
  
  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    // Parse JSON response or return empty object if no content
    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error: any) {
    console.error("API Request failed:", error.message);
    throw error;
  }
}

// API Endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const data = await fetchWithAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      // Save the token to localStorage
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      
      return data;
    },
    
    register: async (name: string, email: string, password: string) => {
      const data = await fetchWithAuth("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      
      // Save the token to localStorage
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      
      return data;
    },
    
    logout: () => {
      localStorage.removeItem("auth_token");
      return Promise.resolve({ success: true });
    },
    
    getProfile: async () => {
      return await fetchWithAuth("/auth/profile");
    },
    
    updateProfile: async (profileData: any) => {
      return await fetchWithAuth("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
    }
  },
  
  // Bids endpoints
  bids: {
    placeBid: async (auctionId: string, bidAmount: number) => {
      return await fetchWithAuth("/bids/place", {
        method: "POST",
        body: JSON.stringify({ auctionId, bidAmount }),
      });
    },
    
    getUserBids: async () => {
      return await fetchWithAuth("/bids/user");
    },
    
    getWonItems: async () => {
      return await fetchWithAuth("/bids/won");
    },
    
    getAuctionBids: async (auctionId: string) => {
      return await fetchWithAuth(`/bids/auction/${auctionId}`);
    }
  },
  
  // Auctions endpoints
  auctions: {
    getAuction: async (auctionId: string) => {
      return await fetchWithAuth(`/auctions/${auctionId}`);
    },
    
    getAuctions: async (filters?: any) => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : "";
      return await fetchWithAuth(`/auctions${queryParams}`);
    }
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("auth_token");
  return !!token; // Return true if token exists
};

// Polling function for real-time updates
export function createPollingEffect(
  fetchFunction: () => Promise<any>,
  callback: (data: any) => void,
  interval = 10000, // Default 10 seconds
  errorHandler?: (error: Error) => void
) {
  let isActive = true;
  let timeoutId: number | undefined;
  
  const poll = async () => {
    if (!isActive) return;
    
    try {
      const data = await fetchFunction();
      callback(data);
    } catch (error: any) {
      console.error("Polling error:", error);
      if (errorHandler) {
        errorHandler(error);
      }
    } finally {
      if (isActive) {
        timeoutId = window.setTimeout(poll, interval);
      }
    }
  };
  
  // Start polling
  poll();
  
  // Return cleanup function
  return () => {
    isActive = false;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  };
}

export default api;
