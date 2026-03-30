const API_BASE = 'http://localhost:5678/webhook-test';

export async function apiPost(path, body = null) {
  const response = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  const type = response.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    return response.json();
  }
  return response.text();
}
