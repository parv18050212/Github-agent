import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { BatchUploadResponse, BatchStatusResponse } from "@/types/api";

export function useBatchUpload() {
  return useMutation<BatchUploadResponse, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const { data } = await apiClient.post<BatchUploadResponse>(
        "/api/batch-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
  });
}

export function useBatchStatus(batchId: string | null, options?: { enabled?: boolean }) {
  return useQuery<BatchStatusResponse>({
    queryKey: ["batchStatus", batchId],
    queryFn: async () => {
      const { data } = await apiClient.get<BatchStatusResponse>(`/api/batch/${batchId}`);
      return data;
    },
    enabled: !!batchId && (options?.enabled ?? true),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
  });
}
