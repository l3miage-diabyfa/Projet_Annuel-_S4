// Centralized API utility for fetch requests
export interface ApiOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

export async function apiFetch<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
    try {
        const res = await fetch(url, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            return { data: null, error: data?.message || "Erreur API", status: res.status };
        }
        return { data, error: null, status: res.status };
    } catch (err) {
        return { data: null, error: "Erreur réseau ou serveur", status: 0 };
    }
}
