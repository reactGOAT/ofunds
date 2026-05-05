"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { TwoFAService } from "@/services/twoFA";
import { QueryKeys } from "@/models/query";

export const useEnable2FA = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await TwoFAService.enable2FA();
      return response;
    },
  });
};

export const useDisable2FA = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await TwoFAService.disable2FA();
      return response;
    },
  });
};

export const useEnableTransaction2FA = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await TwoFAService.enableTransaction2FA();
      return response;
    },
  });
};

export const useDisableTransaction2FA = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await TwoFAService.disableTransaction2FA();
      return response;
    },
  });
};

export const use2FAStatus = () => {
  return useQuery({
    queryKey: [QueryKeys.Get_2FA_Status],
    queryFn: async () => {
      const response = await TwoFAService.get2FAStatus();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVerify2FASetup = () => {
  return useMutation({
    mutationFn: async (data: { code: string; secret: string }) => {
      const response = await TwoFAService.verify2FASetup(data.code, data.secret);
      return response;
    },
  });
};
