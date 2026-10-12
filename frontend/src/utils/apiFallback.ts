/**
 * Attempts a real API call first. If it fails (backend not connected
 * yet, network error, 404, etc.) it resolves with the provided mock
 * data instead, after a short simulated delay so loading states are
 * still visible. Swap nothing here to go live — once the backend
 * responds successfully, `request()` wins automatically.
 */
export async function withFallback<T>(
  request: () => Promise<T>,
  fallback: T,
  simulatedDelayMs = 500
): Promise<T> {
  try {
    return await request();
  } catch {
    await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    return fallback;
  }
}
