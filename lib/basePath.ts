import { headers } from "next/headers";

export async function getBasePath(slug: string): Promise<string> {
  const h = await headers();
  return h.get("x-custom-domain") === "1" ? "" : `/${slug}`;
}
