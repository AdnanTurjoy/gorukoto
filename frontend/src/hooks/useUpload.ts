import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<{ url: string }>('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
  });
}
