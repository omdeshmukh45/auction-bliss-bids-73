
// Application configuration

// API configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  pollingInterval: 5000, // 5 seconds
  timeout: 30000, // 30 seconds
};

// App configuration
export const APP_CONFIG = {
  appName: "AuctionBliss",
  supportEmail: "support@auctionbliss.com",
};
