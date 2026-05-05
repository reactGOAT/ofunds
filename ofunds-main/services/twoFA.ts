import axiosInstance from "./axios-instance";

export interface TwoFAEnableResponse {
  status: boolean;
  data: {
    qr_code: string;
    secret: string;
    message: string;
  };
  message: string;
}

export interface TwoFADisableResponse {
  status: boolean;
  data: {
    message: string;
  };
  message: string;
}

export interface TwoFAStatusResponse {
  status: boolean;
  data: {
    enabled: boolean;
    google2fa_enable: number;
    authenticator_secret: string | null;
  };
  message: string;
}

export class TwoFAService {
  // Enable 2FA for account
  static async enable2FA(): Promise<TwoFAEnableResponse> {
    const response = await axiosInstance.post("/google/2fa/enable");
    return response.data;
  }

  // Disable 2FA for account
  static async disable2FA(): Promise<TwoFADisableResponse> {
    const response = await axiosInstance.post("/google/2fa/disable");
    return response.data;
  }

  // Enable 2FA for transactions only
  static async enableTransaction2FA(): Promise<TwoFAEnableResponse> {
    const response = await axiosInstance.post("/google/2fa/transaction/enable");
    return response.data;
  }

  // Disable 2FA for transactions only
  static async disableTransaction2FA(): Promise<TwoFADisableResponse> {
    const response = await axiosInstance.post("/google/2fa/transaction/disable");
    return response.data;
  }

  // Check 2FA status
  static async get2FAStatus(): Promise<TwoFAStatusResponse> {
    const response = await axiosInstance.get("/google/2fa/status");
    return response.data;
  }

  // Verify 2FA setup
  static async verify2FASetup(
    code: string,
    secret: string
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.post("/google/2fa/verify", {
      code,
      secret,
    });
    return response.data;
  }
}
