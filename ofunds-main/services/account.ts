import axiosInstance from "./axios-instance";
// confirm that Hotel is imported from the correct path
export interface GetUserHotelsResponse {
  status_code: number;
  status: boolean;
  data: {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export class AccountService {
  // 👇 Add this method
  public static async getHotelsByUserId(
    userId: number,
    page?: number,
    limit?: number,
  ): Promise<GetUserHotelsResponse> {
    const params: Record<string, number> = {};

    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    const response = await axiosInstance.get<GetUserHotelsResponse>(
      `/hotels/user/${userId}`,
      {
        params,
      },
    );
    return response.data;
  }

  // ...other methods
}
