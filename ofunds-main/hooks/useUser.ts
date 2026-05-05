"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { useJetsendUserStore } from "@/store/jetsend-user-store";
import { QueryKeys } from "@/models/query";

export const useGetUser = () => {
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useQuery({
    queryKey: [QueryKeys.Get_User],
    queryFn: async () => {
      const response = await UserService.getUser();
      if (response.status) {
        setUser(response);
      }
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

export const useUpdateUser = () => {
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: {
      firstname?: string;
      lastname?: string;
      phone?: string;
    }) => {
      const response = await UserService.updateUser(
        data.firstname,
        data.lastname,
        data.phone,
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.status) {
        setUser(response.data);
      }
    },
  });
};

export const useUpdateEmail = () => {
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (new_email: string) => {
      const response = await UserService.updateEmail(new_email);
      return response;
    },
    onSuccess: (response) => {
      if (response.status) {
        setUser(response.data);
      }
    },
  });
};

export const useUpdatePin = () => {
  return useMutation({
    mutationFn: async (pin: string) => {
      const response = await UserService.updatePin(pin);
      return response;
    },
  });
};

export const useUpdateAvatar = () => {
  const setUser = useJetsendUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (avatar: string | File) => {
      const response = await UserService.updateAvatar(avatar);
      return response;
    },
    onSuccess: (response) => {
      if (response.status) {
        setUser(response.data);
      }
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await UserService.deleteAccount();
      return response;
    },
  });
};

export const useSearchUserByEmail = (email: string) => {
  return useQuery({
    queryKey: [QueryKeys.Search_User, email],
    queryFn: async () => {
      if (!email) return [];
      const response = await UserService.searchUserByEmail(email);
      return response.data || [];
    },
    enabled: !!email && email.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetUserByEmail = (email: string) => {
  return useQuery({
    queryKey: [QueryKeys.Get_User, email],
    queryFn: async () => {
      const response = await UserService.getUserByEmail(email);
      return response.data;
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useGetAllUsers = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [QueryKeys.Get_All_Users, page, limit],
    queryFn: async () => {
      const response = await UserService.getAllUsers(page, limit);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
