export async function batchInvalidateQueries(queryClient, queryKeyList) {
  await Promise.all(
    queryKeyList.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    ),
  );
}

export function batchSetQueryData(queryClient, updates) {
  updates.forEach(({ queryKey, updater }) => {
    queryClient.setQueryData(queryKey, updater);
  });
}
