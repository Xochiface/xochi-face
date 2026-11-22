/**
 * "Publish live" in edit mode. Development only (route.dev.ts — this file
 * doesn't exist in the live build; see next.config.ts).
 *
 *   GET  — how many saved changes xochiface.com doesn't have yet
 *   POST — push them to GitHub; Cloudflare rebuilds the site (~2 minutes)
 *
 * Save (app/api/edits) only changes this computer, so edits can be checked
 * in the preview first.
 */
import { push, unpublished } from "@/lib/edits/apply";

export async function GET() {
  return Response.json({ unpublished: await unpublished() });
}

export async function POST() {
  const pushed = await push();
  return Response.json({ pushed, unpublished: await unpublished() });
}
