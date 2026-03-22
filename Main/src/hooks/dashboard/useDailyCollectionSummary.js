import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export function useDailyCollectionSummary(branchId) {
  return useAppQuery(queryConfig.dashboard.dailyCollectionSummary(branchId));
}
