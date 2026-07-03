import { JoinClient } from "@/app/join/JoinClient";
import { getPublicDemand } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const request = await getPublicDemand(params.id ?? null);
  return <JoinClient request={request} />;
}
