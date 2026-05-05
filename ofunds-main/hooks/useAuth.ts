"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import { QueryKeys } from "@/models/query";

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: { email: string; password: string; rememberMe?: boolean }) => {
      const response = await AuthService.login(data.email, data.password);
      return { response, rememberMe: data.rememberMe };
    },
    onSuccess: ({ response, rememberMe }) => {
      if (response.status && response.data) {
        // Set different expiration based on remember me
        const expiresAt = rememberMe 
          ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days if remember me is checked
          : Date.now() + 24 * 60 * 60 * 1000; // 24 hours if not checked
        
        setTokens(response.data.access_token, response.data.chat_token, expiresAt);
        setUser(response.data.user);
      }
    },
  });
};

export const useSignup = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      phone?: string;
    }) => {
      const response = await AuthService.signup(
        data.email,
        data.password,
        data.firstname,
        data.lastname,
        data.phone,
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.status && response.data) {
        setTokens(response.data.access_token, response.data.chat_token);
        setUser(response.data.user);
      }
    },
  });
};

export const usePinLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: { email: string; security_pin: string }) => {
      const response = await AuthService.pinLogin(
        data.email,
        data.security_pin,
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.status && response.data) {
        setTokens(response.data.access_token, response.data.chat_token);
        setUser(response.data.user);
      }
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const clearAll = useJetsendUserStore((state) => state.clearAll);

  return useMutation({
    mutationFn: async () => {
      // Optional: call logout API if backend tracks sessions
      // await AuthService.logout();
    },
    onSuccess: () => {
      logout();
      clearAll();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await AuthService.forgotPassword(email);
      return response;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { verify_code: string; password: string }) => {
      const response = await AuthService.resetPassword(
        data.verify_code,
        data.password,
      );
      return response;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { password: string; new_password: string }) => {
      const response = await AuthService.changePassword(
        data.password,
        data.new_password,
      );
      return response;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: { verify_code: string; email: string }) => {
      const response = await AuthService.verifyOtp(
        data.verify_code,
        data.email,
      );
      return response;
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await AuthService.resendOtp(email);
      return response;
    },
  });
};
