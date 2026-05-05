import axiosInstance from "./axios-instance";

export interface JetsendUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  chat_id: string;
  user_type: string;
  avatar: string;
  picture: string;
  email_status: number;
  app_status: number;
  phone: string;
  affliate_code: string;
  refer: null;
  status: number;
  email_verified_at: string | null;
  jetpay_fcm_token: string | null;
  fcm_token: string | null;
  created_at: string;
  updated_at: string;
  authenticator_secret: null;
  google2fa_enable: number;
  google2fa_enable_date: string | null;
  balance: number;
  wallet: {
    id: number;
    balance: number;
    commission: number;
    currency: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface AuthResponse {
  status: boolean;
  data: {
    access_token: string;
    token_type: string;
    chat_token: string;
    user: JetsendUser;
  };
  message: string;
}

export class AuthService {
  static async signup(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    phone?: string,
  ): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", {
      email,
      password,
      password_confirmation: password,
      firstname,
      lastname,
      ...(phone && { phone }),
    });
    return response.data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  }

  static async pinLogin(
    email: string,
    security_pin: string,
  ): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/login/pin", {
      email,
      security_pin,
    });
    return response.data;
  }

  static async forgotPassword(
    email: string,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.post("/auth/forget/password", {
      email,
    });
    return response.data;
  }

  static async resetPassword(
    verify_code: string,
    password: string,
  ): Promise<{ status: boolean; data: string; message?: string }> {
    const response = await axiosInstance.post("/auth/reset/password/web", {
      verify_code,
      password,
      password_confirmation: password,
    });
    return response.data;
  }

  static async changePassword(
    password: string,
    new_password: string,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.post("/auth/change/password", {
      password,
      new_password,
      new_password_confirmation: new_password,
    });
    return response.data;
  }

  static async verifyOtp(
    verify_code: string,
    email: string,
  ): Promise<{ status: boolean; data: string; message: string }> {
    const response = await axiosInstance.post("/auth/verify/otp", {
      verify_code,
      email,
    });
    return response.data;
  }

  static async resendOtp(
    email: string,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.post("/auth/resend/otp", {
      email,
    });
    return response.data;
  }

  static async updateFcmToken(
    fcm_token: string,
  ): Promise<{ status: boolean; data: JetsendUser; message: string }> {
    const response = await axiosInstance.post("/auth/jetpay/fcm/token", {
      jetpay_fcm_token: fcm_token,
    });
    return response.data;
  }

  static async getUserByChatId(
    chat_id: string,
  ): Promise<{ status: boolean; data: JetsendUser; message: string }> {
    const response = await axiosInstance.get(`/auth/user/chat/${chat_id}`);
    return response.data;
  }
}
