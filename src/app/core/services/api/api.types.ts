export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Endpoint publik — tidak retry refresh saat 401. */
  skipAuth?: boolean;
  /** Tidak retry refresh saat 401. */
  skipRefresh?: boolean;
  /** Default `true` — cookie auth dikirim otomatis ke backend. */
  withCredentials?: boolean;
}
