import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "query/prefetch";

const isMobileViewport = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
};

export const usePrefetchOnHover = (configFactory, delay = 120) => {
  const queryClient = useQueryClient();
  const timerRef = useRef(null);
  const prefetchedIdsRef = useRef(new Set());

  const clearPendingPrefetch = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearPendingPrefetch, []);

  const onMouseEnter = (id) => {
    clearPendingPrefetch();

    if (!id || typeof configFactory !== "function" || isMobileViewport()) {
      return;
    }

    timerRef.current = setTimeout(() => {
      const configs = []
        .concat(configFactory(id) || [])
        .filter((config) => config?.prefetch && config?.key && config?.fn);

      if (configs.length === 0) {
        return;
      }

      const hasFreshCache = configs.every((config) => {
        const cacheState = queryClient.getQueryState(config.key);
        return cacheState?.status === "success";
      });

      if (hasFreshCache || prefetchedIdsRef.current.has(id)) {
        return;
      }

      prefetchedIdsRef.current.add(id);
      Promise.all(
        configs.map((config) => prefetchQuery(queryClient, config)),
      ).catch(() => {
        prefetchedIdsRef.current.delete(id);
      });
    }, delay);
  };

  return {
    onMouseEnter,
    onMouseLeave: clearPendingPrefetch,
  };
};
