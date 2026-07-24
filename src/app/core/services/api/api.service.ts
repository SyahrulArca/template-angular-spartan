import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { appEnv } from '../../config/app-env';
import { API_WITH_CREDENTIALS_DEFAULT } from './api.constants';
import { SKIP_AUTH, SKIP_REFRESH } from './api.context';
import type { ApiRequestConfig } from './api.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = appEnv.apiUrl.replace(/\/$/, '');

  get<T>(path: string, config?: ApiRequestConfig): Observable<T> {
    return this.http.get<T>(this.resolveUrl(path), this.toHttpOptions(config));
  }

  post<T>(path: string, body?: unknown, config?: ApiRequestConfig): Observable<T> {
    return this.http.post<T>(this.resolveUrl(path), body ?? null, this.toHttpOptions(config));
  }

  put<T>(path: string, body?: unknown, config?: ApiRequestConfig): Observable<T> {
    return this.http.put<T>(this.resolveUrl(path), body ?? null, this.toHttpOptions(config));
  }

  patch<T>(path: string, body?: unknown, config?: ApiRequestConfig): Observable<T> {
    return this.http.patch<T>(this.resolveUrl(path), body ?? null, this.toHttpOptions(config));
  }

  delete<T>(path: string, config?: ApiRequestConfig): Observable<T> {
    return this.http.delete<T>(this.resolveUrl(path), this.toHttpOptions(config));
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  private toHttpOptions(config?: ApiRequestConfig) {
    return {
      headers: this.buildHeaders(config?.headers),
      params: this.buildParams(config?.params),
      context: this.buildContext(config),
      withCredentials: config?.withCredentials ?? API_WITH_CREDENTIALS_DEFAULT,
    };
  }

  private buildHeaders(extra?: Record<string, string>): HttpHeaders | undefined {
    if (!extra || Object.keys(extra).length === 0) {
      return undefined;
    }

    return new HttpHeaders(extra);
  }

  private buildParams(
    params?: Record<string, string | number | boolean | null | undefined>,
  ): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) {
        continue;
      }
      httpParams = httpParams.set(key, String(value));
    }

    return httpParams.keys().length > 0 ? httpParams : undefined;
  }

  private buildContext(config?: ApiRequestConfig): HttpContext | undefined {
    if (!config?.skipAuth && !config?.skipRefresh) {
      return undefined;
    }

    const context = new HttpContext();
    if (config.skipAuth) {
      context.set(SKIP_AUTH, true);
    }
    if (config.skipRefresh) {
      context.set(SKIP_REFRESH, true);
    }

    return context;
  }
}
