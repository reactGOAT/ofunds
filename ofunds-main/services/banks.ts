import axiosInstance from "./axios-instance";

export interface Bank {
  bankCode: string;
  bankName: string;
  bankUrl: string;
  bgUrl: string;
  name: string;
  code: string;
}

export interface WithdrawalBank {
  bankCode: string;
  bankName: string;
  name: string;
  code: string;
}

export interface UserBank {
  id: number;
  account_reference: string;
  user_id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  created_at: string;
  updated_at: string;
}

export interface BankResponse {
  status: boolean;
  data: Bank | Bank[];
  message: string;
}

export class BankService {
  static async addBank(
    account_number: string,
    bank_code: string,
    bank_name: string,
    account_name?: string,
  ): Promise<{
    status: boolean;
    data: {
      status: string;
      data: UserBank[];
      message: string;
    };
    message: string;
  }> {
    const response = await axiosInstance.post("/add/bank", {
      bank: bank_code,
      bank_name: bank_name,
      account: account_number,
      account_name: account_name,
    });
    return response.data;
  }

  static async getUserBanks(): Promise<{
    status: boolean;
    data: {
      status: string;
      data: UserBank[];
    };
    message: string;
  }> {
    const response = await axiosInstance.get("/get/banks");
    return response.data;
  }

  static async deleteUserBank(
    bank_id: number,
  ): Promise<{ status: boolean; data: { message: string }; message: string }> {
    const response = await axiosInstance.delete(`/banks/${bank_id}`);
    return response.data;
  }

  static async addOfundsBank(
    account_name: string,
    account_number: string,
    bank_code: string,
    bank_name: string,
  ): Promise<BankResponse> {
    const response = await axiosInstance.post("/ofunds/bank", {
      account_name,
      account_number,
      bank_code,
      bank_name,
    });
    return response.data;
  }

  static async getWithdrawalBanks(): Promise<{
    status: boolean;
    data: {
      status: string;
      data: Bank[];
    };
    message: string;
  }> {
    const response = await axiosInstance.get("/get/withdrawal/banks");
    return response.data;
  }

  static async verifyBankAccount(
    account_number: string,
    bank_code: string,
  ): Promise<{
    status: boolean;
    data: {
      account_name: string;
      account_number: string;
      bank_code: string;
      bank_name: string;
    };
    message: string;
  }> {
    const response = await axiosInstance.get(
      `/verify/bank?account_number=${account_number}&bank_code=${bank_code}`,
    );
    return response.data;
  }

  static async getAllBanks(): Promise<{
    status: boolean;
    data: { 
      status: string;
      data: WithdrawalBank[];
    };
    message: string;
  }> {
    const response = await axiosInstance.get("/get/withdrawal/banks");
    return response.data;
  }
}
