import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getCollectionsByDateRange(params = {}) {
  const { data } = await api.get(ENDPOINTS.COLLECTIONS.list, { params });
  return data;
}

export async function getOverdueCount(params = {}) {
  const { data } = await api.get(
    ENDPOINTS.COLLECTIONS.overdueCount,
    { params }
  );
  return data;
}

export async function getOverdueCollections(params = {}) {
 const { data } = await api.get( ENDPOINTS.COLLECTIONS.overdue, 
  { params } ); 
  return data; 
}
