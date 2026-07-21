import {
  isJoinableRequest,
  parentRequests,
  type JoinApplication,
  type ParentRequest,
} from "@/lib/requests";

type DemandInsert = Omit<ParentRequest, "id" | "daysLeft" | "createdAt" | "expiresAt" | "status"> & {
  contact: string;
};

type JoinInsert = Omit<JoinApplication, "id" | "status" | "createdAt" | "demand">;

type StoredDemand = Omit<ParentRequest, "daysLeft" | "expiresAt"> & {
  daysLeft?: number | null;
  expiresAt?: string | null;
  expires_at?: string | null;
  expireAt?: string | null;
  contact?: string;
};

const PUBLIC_STATUSES = ["active", "full_pending", "completed", "expired"];

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export function isDatabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured.");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export async function listPublicDemands(): Promise<ParentRequest[]> {
  if (!isDatabaseConfigured()) return parentRequests.filter(isJoinableRequest);

  const query = new URLSearchParams({
    select: "*",
    status: "eq.active",
    order: "createdAt.desc",
  });
  const demands = await supabaseRequest<StoredDemand[]>(`demands?${query}`);
  // Expiry metadata is display-only on the demand wall. Joining is gated by
  // the persisted active status and available capacity.
  return demands.map(toPublicDemand).filter(isJoinableRequest);
}

export async function getPublicDemand(id: string | null): Promise<ParentRequest | null> {
  if (!id) return parentRequests[0] ?? null;
  if (!isDatabaseConfigured()) {
    return parentRequests.find((request) => request.id === id) ?? parentRequests[0] ?? null;
  }

  const query = new URLSearchParams({
    select: "*",
    id: `eq.${id}`,
    status: `in.(${PUBLIC_STATUSES.join(",")})`,
    limit: "1",
  });
  const demands = await supabaseRequest<StoredDemand[]>(`demands?${query}`);
  return demands[0] ? toPublicDemand(demands[0]) : null;
}

export async function createDemand(input: DemandInsert) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 7);

  if (!isDatabaseConfigured()) throw new Error("还没有配置 Supabase 数据库，暂时不能保存需求。");

  await supabaseRequest<StoredDemand[]>("demands", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      ...input,
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }),
  });
}

export async function createJoinApplication(input: JoinInsert) {
  if (!isDatabaseConfigured()) throw new Error("还没有配置 Supabase 数据库，暂时不能保存加入意向。");

  await supabaseRequest<JoinApplication[]>("joinApplications", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
  });
}

export async function getAdminData() {
  if (!isDatabaseConfigured()) {
    return {
      configured: false,
      demands: [] as StoredDemand[],
      joinApplications: [] as JoinApplication[],
    };
  }

  const demandQuery = new URLSearchParams({ select: "*", order: "createdAt.desc" });
  const joinQuery = new URLSearchParams({ select: "*", order: "createdAt.desc" });
  const [demands, joinApplications] = await Promise.all([
    supabaseRequest<StoredDemand[]>(`demands?${demandQuery}`),
    supabaseRequest<JoinApplication[]>(`joinApplications?${joinQuery}`),
  ]);

  return {
    configured: true,
    demands,
    joinApplications: joinApplications.map((application) => ({
      ...application,
      demand: demands.find((demand) => demand.id === application.demandId),
    })),
  };
}

export async function updateDemandStatus(id: string, status: StoredDemand["status"]) {
  await supabaseRequest("demands?id=eq." + encodeURIComponent(id), {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status }),
  });
}

export async function approveJoinApplication(id: string) {
  const applicationQuery = new URLSearchParams({
    select: "*",
    id: `eq.${id}`,
    limit: "1",
  });
  const applications = await supabaseRequest<JoinApplication[]>(`joinApplications?${applicationQuery}`);
  const application = applications[0];
  if (!application || application.status !== "pending") return;

  const demandQuery = new URLSearchParams({
    select: "*",
    id: `eq.${application.demandId}`,
    limit: "1",
  });
  const demands = await supabaseRequest<StoredDemand[]>(`demands?${demandQuery}`);
  const demand = demands[0];
  if (!demand) return;

  const nextPeople = Math.min(demand.currentPeople + 1, demand.targetPeople);
  const nextStatus = nextPeople >= demand.targetPeople ? "full_pending" : demand.status;

  await Promise.all([
    supabaseRequest("joinApplications?id=eq." + encodeURIComponent(id), {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "approved" }),
    }),
    supabaseRequest("demands?id=eq." + encodeURIComponent(demand.id), {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ currentPeople: nextPeople, status: nextStatus }),
    }),
  ]);
}

export async function rejectJoinApplication(id: string) {
  await supabaseRequest("joinApplications?id=eq." + encodeURIComponent(id), {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status: "rejected" }),
  });
}

function toPublicDemand(demand: StoredDemand): ParentRequest {
  const { contact: _contact, ...publicDemand } = demand;
  const expiresAt = demand.expiresAt ?? demand.expires_at ?? demand.expireAt ?? null;
  const calculatedDaysLeft = getDaysLeft(expiresAt);
  const storedDaysLeft =
    typeof demand.daysLeft === "number" && Number.isFinite(demand.daysLeft)
      ? demand.daysLeft
      : null;

  return {
    ...publicDemand,
    expiresAt,
    daysLeft: calculatedDaysLeft ?? storedDaysLeft,
  };
}

function getDaysLeft(expiresAt: string | null) {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (!Number.isFinite(ms)) return null;
  return Math.max(Math.ceil(ms / 86_400_000), 0);
}
