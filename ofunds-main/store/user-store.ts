import { create } from "zustand";
import Cookies from "js-cookie";
import { decrypt, encrypt } from "@/services/encryption";
import { OfundsRoutes } from "@/routes";

export interface Authority {
  authority_active: boolean;
  authority_end_date: string;
  authority_id: number;
  authority_start_date: string;
  employee_id: number;
  hotel_department_id: number;
  hotel_id: number;
  staff_id: number;
}

export interface UserData {
  id: number;
  email: string;
  stripe_id: null;
  login_count: number;
  first_name: string;
  last_name: string;
  country_id: null;
  country_alpha3_code: null;
  phone_number: null;
  email_verified_at: null;
  phone_number_verified_at: null;
  otp: number;
  email_verify_token: null;
  phone_no_verify_token: null;
  password_token: null;
  photo: string;
  device_id: string;
  role: null;
  is_blacklist: string;
  subscription_id: null;
  subscription_type: null;
  stripe_account_id: null;
  stripe_account_verified: string;
  otp_expires_at: Date;
  email_verify_expires_at: null;
  password_reset_expires_at: Date;
  birthday: null;
  birthmonth: null;
  birthyear: null;
  subscription_status: string;
  subscription_date: null;
  subscription_expiry_year: null;
  subscription_expiry_month: null;
  subscription_expiry_day: null;
  subscription_expiry_date: null;
  stripe_customer_id: null;
  google_id: null;
  apple_id: null;
  created_at: Date;
  updated_at: Date;
  site360_token: string;
  site360_token_expires_at: Date;
  hr_is_otp_verified: number;
  hr_otp: null;
  hr_otp_expires_at: null;
  employee_id: number;
  authority_id: number;
  authority: Authority;
  staff_id: number;
  country: null;
}

export interface UserAuthDetails {
  email: string;
  password: string;
}

interface UserState {
  userData: UserData | null;
  authority: Authority | null;
  userAuthDetails: UserAuthDetails | null;
  preSaveUserData: Record<string, unknown> | null;
  token: string | null;
  hotelId: string | null;
  organizationId: string | null;
  isAuthenticated: boolean;
  saveUserToken: (token: string) => void;
  saveUserData: (data: UserData) => void;
  saveUserAuthDetails: (details: UserAuthDetails) => void;
  saveAuthority: (data: Authority) => void;
  removeUserAuthDetails: () => void;
  rememberUserDetails: (details: Record<string, unknown>) => void;
  removeRememberUserDetails: () => void;
  removeUserData: () => void;
  loadUserData: () => void;
  saveHotelId: (data: string) => void;
  saveOrganizationId: (data: string) => void;
  logout: () => void;
}

const currentDate = new Date();
const newDate = new Date(currentDate);
newDate.setHours(currentDate.getHours() + 24); // 24-hour expiration

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Function to save encrypted data in cookies
const saveToCookies = (
  key: string,
  data:
    | Record<string, unknown>
    | UserData
    | UserAuthDetails
    | string
    | boolean
    | Authority,
): void => {
  if (!isBrowser) return;

  const encryptedData = encrypt(JSON.stringify(data));

  // Check cookie size before setting
  if (encryptedData.length > 3500) {
    console.warn(
      `⚠️ Cookie ${key} is too large:`,
      encryptedData.length,
      "bytes",
    );
  }

  Cookies.set(key, encryptedData, {
    httpOnly: false,
    expires: newDate,
    path: "/",
    secure: true,
    sameSite: "strict",
  });
};

// Function to save data without encryption
const saveToCookiesWithoutEncryption = (key: string, data: string): void => {
  if (!isBrowser) return;

  Cookies.set(key, data, {
    httpOnly: false,
    expires: newDate,
    path: "/",
    secure: true,
    sameSite: "strict",
  });
};

// Function to get decrypted data from cookies
const getFromCookies = (key: string): Record<string, unknown> | null => {
  if (!isBrowser) return null;

  try {
    const cookieData = decrypt(Cookies.get(key));
    if (cookieData) {
      if (typeof cookieData == "string") {
        try {
          return JSON.parse(cookieData);
        } catch {
          return { value: cookieData };
        }
      } else {
        return cookieData;
      }
    }
  } catch (error) {
    console.error("Error reading cookie:", key, error);
  }
  return null;
};

// Function to get raw cookie data
const getRawCookie = (key: string): string | null => {
  if (!isBrowser) return null;
  return Cookies.get(key) || null;
};

// Function to remove data from cookies
const removeFromCookies = (key: string): void => {
  if (!isBrowser) return;
  Cookies.remove(key);
};

// Safe initialization functions
const initializeUserData = (): UserData | null => {
  if (!isBrowser) return null;
  return (getFromCookies("quick-rooms:user") as unknown as UserData) ?? null;
};

const initializeAuthority = (): Authority | null => {
  if (!isBrowser) return null;
  return (
    (getFromCookies("quick-rooms:authority") as unknown as Authority) ?? null
  );
};

const initializeToken = (): string | null => {
  if (!isBrowser) return null;
  const rawToken = getRawCookie("quick-rooms:token");
  return rawToken ? decrypt(rawToken) : null;
};

const initializeHotelId = (): string | null => {
  if (!isBrowser) return null;
  return getRawCookie("quick-rooms:hotelId");
};

const initializeOrganizationId = (): string | null => {
  if (!isBrowser) return null;
  return getRawCookie("quick-rooms:organizationId");
};

// Zustand store using cookies
export const useStore = create<UserState>((set, get) => ({
  userData: initializeUserData(),
  authority: initializeAuthority(),
  userAuthDetails: null,
  preSaveUserData: null,
  token: initializeToken(),
  hotelId: initializeHotelId(),
  organizationId: initializeOrganizationId(),

  // Computed property for authentication status
  get isAuthenticated() {
    const state = get();
    return !!(state.userData && state.token);
  },

  saveUserData: (data: UserData) => {
    saveToCookies("quick-rooms:user", data);
    set({ userData: data });
  },

  saveUserAuthDetails: (data: UserAuthDetails) => {
    saveToCookies("quick-rooms:auth", data);
    set({ userAuthDetails: data });
  },

  removeUserAuthDetails: () => {
    removeFromCookies("quick-rooms:auth");
    set({ userAuthDetails: null });
  },

  saveUserToken: (data: string) => {
    saveToCookies("quick-rooms:token", data);
    set({ token: data });
  },

  saveAuthority: (data: Authority) => {
    saveToCookies("quick-rooms:authority", data);
    set({ authority: data });
  },

  saveHotelId: (data: string) => {
    saveToCookiesWithoutEncryption("quick-rooms:hotelId", data);
    set({ hotelId: data });
  },
  saveOrganizationId: (data: string) => {
    saveToCookiesWithoutEncryption("quick-rooms:organizationId", data);
    set({ hotelId: data });
  },

  rememberUserDetails: (data: Record<string, unknown>) => {
    saveToCookies("rememberMe", data);
    set({ preSaveUserData: data });
  },

  removeRememberUserDetails: () => {
    removeFromCookies("rememberMe");
    set({ preSaveUserData: null });
  },

  removeUserData: () => {
    removeFromCookies("quick-rooms:user");
    set({ userData: null });
  },

  loadUserData: () => {
    if (!isBrowser) return;

    const userData = getFromCookies("quick-rooms:user") as UserData | null;
    const token = initializeToken();
    const hotelId = initializeHotelId();
    const organizationId = initializeOrganizationId();
    const authority = initializeAuthority();

    console.log("🔄 Loading user data from cookies:", {
      hasUserData: !!userData,
      hasToken: !!token,
      hasHotelId: !!hotelId,
      hasOrganizationId: !!organizationId,
      userEmail: userData?.email || "none",
    });

    set({
      userData,
      token,
      hotelId,
      organizationId,
      authority,
    });
  },

  logout: () => {
    removeFromCookies("quick-rooms:user");
    removeFromCookies("quick-rooms:token");
    removeFromCookies("quick-rooms:hotelId");
    removeFromCookies("quick-rooms:organizationId");
    removeFromCookies("quick-rooms:auth");
    removeFromCookies("quick-rooms:authority");
    removeFromCookies("quick-rooms:selected-hotel");
    set({
      userData: null,
      token: null,
      hotelId: null,
      organizationId: null,
      preSaveUserData: null,
      userAuthDetails: null,
    });
    // Redirect to hotel login using routes constant
    if (isBrowser) {
      window.location.href = OfundsRoutes.login;
    }
  },
}));
