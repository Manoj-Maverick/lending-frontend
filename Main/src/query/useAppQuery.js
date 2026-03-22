import { useQuery } from "@tanstack/react-query";

export const useAppQuery = (config) => {
  const {
    key,
    fn,
    cacheTime,
    keepPreviousData,
    prefetch,
    placeholderData,
    ...options
  } = config;

  return useQuery({
    queryKey: key,
    queryFn: fn,
    gcTime: cacheTime,
    placeholderData:
      placeholderData ?? (keepPreviousData ? (previousData) => previousData : undefined),
    ...options,
  });
};

