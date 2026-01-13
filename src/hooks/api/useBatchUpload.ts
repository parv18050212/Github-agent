import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import apiClient from "@/lib/api/client";
import type { BatchUploadResponse, BatchStatusResponse } from "@/types/api";

export function useBatchUpload() {
  return useMutation<BatchUploadResponse, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      // Use axios directly to avoid apiClient's default JSON headers
      const baseURL = apiClient.defaults.baseURL || "";
      const { data } = await axios.post<BatchUploadResponse>(
        `${baseURL}/api/batch-upload`,
        formData
      );
      return data;
    },
  });
}

export function useBatchStatus(batchId: string | null, options?: { enabled?: boolean }) {
  return useQuery<BatchStatusResponse>({
    queryKey: ["batchStatus", batchId],
    queryFn: async () => {
      const { data } = await apiClient.get<BatchStatusResponse>(`/api/batch/${batchId}/status`);
      return data;
    },
    enabled: !!batchId && (options?.enabled ?? true),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling when batch is completed or failed
      if (status === "completed" || status === "failed") {
        return false;
      }
      // Poll every 2 seconds while processing
      return 2000;
    },
  });
}

