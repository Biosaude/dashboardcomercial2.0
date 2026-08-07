import { describe, expect, it } from "vitest";

import { createLogger, type LogEntry } from "@/lib/logger";

describe("structured logger", () => {
  it("writes a structured entry with merged context", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ request_id: "request-1" }, (entry) => entries.push(entry));

    logger.info("foundation.ready", { phase: 1 });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      level: "info",
      message: "foundation.ready",
      context: { request_id: "request-1", phase: 1 },
    });
  });
});
