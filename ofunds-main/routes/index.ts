// Ofunds Application Routes

// Ofunds Application Types
export type CardsPageType = "overview" | "add" | "send";
export type HistoryPageType = "transactions" | "transfers";

export class OfundsRoutes {
  // Auth Routes
  static readonly signUp = "/auth/signup";
  static readonly login = "/login";
  
  // Main Application Routes
  static readonly home = "/";
  static readonly dashboard = "/dashboard";
  static readonly cards = "/cards";
  static readonly history = "/history";

  // API Routes
  static readonly api = {
    auth: "/api/auth",
    user: "/api/user",
    transactions: "/api/transactions",
    banks: "/api/banks",
    ofunds: "/api/ofunds",
  };

  // Dynamic route functions
  static readonly cardsWithTab = (tab: CardsPageType) => `/cards?tab=${tab}`;
  static readonly historyWithTab = (tab: HistoryPageType) => `/history?tab=${tab}`;

  // Route Categories
  static readonly publicRoutes = [
    OfundsRoutes.signUp,
    OfundsRoutes.login,
    OfundsRoutes.home,
  ];

  static readonly protectedRoutes = [
    OfundsRoutes.dashboard,
    OfundsRoutes.cards,
    OfundsRoutes.history,
  ];

  // Helper methods
  static isPublicRoute(pathname: string): boolean {
    return this.publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  }

  static isProtectedRoute(pathname: string): boolean {
    return this.protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  }

  static isApiRoute(pathname: string): boolean {
    return pathname.startsWith("/api/");
  }
}
