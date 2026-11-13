import { siteConfig } from "@/config/site";

export async function GET() {
  const pubId = siteConfig.publisherId.replace("ca-", "");
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
