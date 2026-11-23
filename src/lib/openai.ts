export async function openAiRequest<T>(apiKey: string, path: string, init: RequestInit = {}) {
  let response: Response;

  try {
    response = await fetch(`https://api.openai.com/v1/${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
  } catch {
    throw new Error('Could not reach the OpenAI API. Check your internet connection.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.error) {
    const message = data?.error?.message ?? `${response.status} ${response.statusText}`;
    throw new Error(`OpenAI API error: ${message}`);
  }

  return data as T;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
