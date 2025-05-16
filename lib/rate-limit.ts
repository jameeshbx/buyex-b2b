// In-memory store for development
const memoryStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(ip: string): Promise<{ success: boolean }> {
  const key = `rate-limit:${ip}`;
  const limit = 5; // Maximum 5 requests
  const window = 60 * 60; // 1 hour window

  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + window * 1000 });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count++;
  return { success: true };
}
