import { HomeClient } from "@/app/HomeClient";
import { listPublicDemands } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const requests = await listPublicDemands();
  return <HomeClient requests={requests} />;
}
