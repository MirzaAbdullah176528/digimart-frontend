const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-api-backend.ajjh564356165649.workers.dev';

interface RequestOptions {
  method?: string;
  body?: any;
  params?: Record<string, string>;
}

interface ApiServiceDeps {
  getToken: () => string | null;
  setToken: (token: string | null) => void;
}

export function createApiService({ getToken, setToken }: ApiServiceDeps) {

  const refresh = async (): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      setToken(null);
      window.dispatchEvent(new Event('session:expired'));
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json();
    const newToken: string = data.accessToken;
    setToken(newToken);
    return newToken;
  };

  const request = async (endpoint: string, options: RequestOptions = {}, retry = true): Promise<any> => {
    const { method = 'GET', body, params } = options;

    const headers: Record<string, string> = {};

    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let url = `${BASE_URL}${endpoint}`;
    if (params) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, config);

    if (response.status === 401 && retry) {
      const newToken = await refresh();
      headers['Authorization'] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, { ...config, headers });
      const retryData = await retryResponse.json();
      if (!retryResponse.ok) throw new Error(retryData.error || retryData.message || 'Request failed');
      return retryData;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Request failed');
    return data;
  };

  return {
    login: (credentials: any) => request('/auth/login', { method: 'POST', body: credentials }),
    signup: (userData: any) => request('/auth/sign-up', { method: 'POST', body: userData }),
    getProducts: () => request('/products', { method: 'GET' }),
    logOut: () => request('/auth/logout', {method: 'POST'})
  };
}