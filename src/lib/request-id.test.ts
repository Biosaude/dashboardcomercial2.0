import { describe, expect, it } from "vitest";

import { createRequestId, resolveRequestId } from "@/lib/request-id";

describe("request ID", () => {
  it("creates a secure UUID and preserves a valid propagated value", () => {
    const requestId = createRequestId();

    expect(requestId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(resolveRequestId(requestId)).toBe(requestId);
  });

  it("replaces an invalid propagated value", () => {
    expect(resolveRequestId("not-a-request-id")).not.toBe("not-a-request-id");
  });
});
