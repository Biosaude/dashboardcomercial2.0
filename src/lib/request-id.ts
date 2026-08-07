const REQUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function resolveRequestId(candidate?: string): string {
  return candidate && REQUEST_ID_PATTERN.test(candidate) ? candidate : createRequestId();
}
