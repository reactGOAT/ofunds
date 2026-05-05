import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidateQuery = (queryKey: QueryKey) => {
    queryClient.invalidateQueries({
      queryKey,
      type: "all",
      refetchType: "all",
    });
  };

  return { invalidateQuery };
};
