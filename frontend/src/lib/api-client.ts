export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Request gagal");
  }
  return payload.data as T;
}
