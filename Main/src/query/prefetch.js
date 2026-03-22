export const prefetchQuery = (queryClient, config) => {
  if (!config?.prefetch || !config?.key || !config?.fn) {
    return Promise.resolve();
  }

  return queryClient.prefetchQuery({
    queryKey: config.key,
    queryFn: config.fn,
    staleTime: config.staleTime,
    gcTime: config.cacheTime,
  });
};
