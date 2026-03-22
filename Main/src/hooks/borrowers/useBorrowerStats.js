import { queryConfig } from "query/queryConfig";
import { useAppQuery } from "query/useAppQuery";

export const useBorrowerStats = (branchId) => {
  return useAppQuery(queryConfig.borrowers.stats(branchId));
};
