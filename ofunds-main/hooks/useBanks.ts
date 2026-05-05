"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { BankService } from "@/services/banks";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import { QueryKeys } from "@/models/query";

export const useGetUserBanks = () => {
  const setBanks = useJetsendUserStore((state) => state.setBanks);

  return useQuery({
    queryKey: [QueryKeys.Get_Banks],
    queryFn: async () => {
      const response = await BankService.getUserBanks();
      if (response.status) {
        setBanks(response.data.data);
      }
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

export const useAddBank = () => {
  const setBanks = useJetsendUserStore((state) => state.setBanks);

  return useMutation({
    mutationFn: async (data: {
      account_number: string;
      bank_code: string;
      bank_name: string;
      account_name?: string;
    }) => {
      const response = await BankService.addBank(
        data.account_number,
        data.bank_code,
        data.bank_name,
        data.account_name,
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.status && response.data?.data) {
        // Response returns array of all user banks, update store
        setBanks(response.data.data);
      }
    },
  });
};

export const useDeleteBank = () => {
  const removeBank = useJetsendUserStore((state) => state.removeBank);

  return useMutation({
    mutationFn: async (bank_id: number) => {
      const response = await BankService.deleteUserBank(bank_id);
      return response;
    },
    onSuccess: (response, variables) => {
      if (response.status) {
        removeBank(variables);
      }
    },
  });
};

export const useGetWithdrawalBanks = () => {
  return useQuery({
    queryKey: [QueryKeys.Get_Withdrawal_Banks],
    queryFn: async () => {
      const response = await BankService.getWithdrawalBanks();
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useVerifyBankAccount = (
  account_number: string,
  bank_code: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: [QueryKeys.Verify_Bank, account_number, bank_code],
    queryFn: async () => {
      const response = await BankService.verifyBankAccount(
        account_number,
        bank_code,
      );
      return response.data;
    },
    enabled: enabled && !!account_number && !!bank_code,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

export const useGetAllBanks = () => {
  return useQuery({
    queryKey: ["all-banks"],
    queryFn: () => BankService.getAllBanks(),
    staleTime: 1000 * 60 * 60, // 1 hour
    select: (data) => data?.data?.data || [], // Extract the nested data array
  });
};

export const useAddOfundsBank = () => {
  const addBank = useJetsendUserStore((state) => state.addBank);

  return useMutation({
    mutationFn: async (data: {
      account_name: string;
      account_number: string;
      bank_code: string;
      bank_name: string;
    }) => {
      const response = await BankService.addOfundsBank(
        data.account_name,
        data.account_number,
        data.bank_code,
        data.bank_name,
      );
      return response;
    },
    onSuccess: (response) => {
      if (
        response.status &&
        response.data &&
        typeof response.data === "object"
      ) {
        addBank(response.data as any);
      }
    },
  });
};
