import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getExpenseCategories() {
  const { data } = await api.get(ENDPOINTS.EXPENSES.categories);
  return data;
}

export async function getExpenses(params = {}) {
  const { data } = await api.get(ENDPOINTS.EXPENSES.list, {
    params: {
      branch_id: params.branch_id || undefined,
      category_id: params.category_id || undefined,
      start_date: params.start_date || undefined,
      end_date: params.end_date || undefined,
      page: params.page || 1,
      limit: params.limit || 10,
    },
  });

  return data;
}

export async function createExpense(payload) {
  const { data } = await api.post(ENDPOINTS.EXPENSES.create, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function getExpenseSummary(params = {}) {
  const { data } = await api.get(ENDPOINTS.EXPENSES.summary, {
    params: {
      branch_id: params.branch_id || undefined,
      start_date: params.start_date || undefined,
      end_date: params.end_date || undefined,
    },
  });
  return data;
}

export async function getExpenseMonthlyTrend(params = {}) {
  const { data } = await api.get(ENDPOINTS.EXPENSES.monthlyTrend, {
    params: {
      branch_id: params.branch_id || undefined,
      start_date: params.start_date || undefined,
      end_date: params.end_date || undefined,
    },
  });
  return data;
}
