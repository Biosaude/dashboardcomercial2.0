import { z } from "zod";

export const technicalHealthSchema = z.object({
  status: z.literal("ok"),
  requestId: z.uuid(),
});
