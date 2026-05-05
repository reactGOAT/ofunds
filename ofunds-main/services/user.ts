import axiosInstance from "./axios-instance";
import { JetsendUser } from "./auth";

export class UserService {
  static async getUser(): Promise<JetsendUser> {
    const response = await axiosInstance.get("/user");
    return response.data;
  }

  static async updateUser(
    firstname?: string,
    lastname?: string,
    phone?: string,
  ): Promise<{ status: boolean; data: JetsendUser; message: string }> {
    const response = await axiosInstance.post("/user", {
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(phone && { phone }),
    });
    return response.data;
  }

  static async updateEmail(
    new_email: string,
  ): Promise<{ status: boolean; data: JetsendUser; message: string }> {
    const response = await axiosInstance.post("/auth/change/user/email", {
      email: new_email,
    });
    return response.data;
  }

  static async updatePin(
    pin: string,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.post("/auth/update/pin", {
      pin,
      pin_confirmation: pin,
    });
    return response.data;
  }

  static async updateAvatar(
    avatar: string | File,
  ): Promise<{ status: boolean; data: JetsendUser; message: string }> {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await axiosInstance.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async deleteAccount(): Promise<{
    status: boolean;
    data: { message: string };
    message: string;
  }> {
    const response = await axiosInstance.post("/user/delete");
    return response.data;
  }

  static async searchUserByEmail(
    email: string,
  ): Promise<{ status: boolean; data: JetsendUser[]; message: string }> {
    const response = await axiosInstance.get(`/user/search?email=${email}`);
    return response.data;
  }

  static async getUserByEmail(
    email: string,
  ): Promise<{ status: boolean; data: JetsendUser; message: string }> {
    const response = await axiosInstance.get(`/user/email/${email}`);
    return response.data;
  }

  static async getAllUsers(
    page?: number,
    limit?: number,
  ): Promise<{ status: boolean; data: JetsendUser[]; message: string }> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await axiosInstance.get(`/users?${params.toString()}`);
    return response.data;
  }
}
