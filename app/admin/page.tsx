"use client";

import { FormEvent, useMemo, useState } from "react";
import type { JoinApplication, ParentRequest } from "@/lib/requests";

type AdminDemand = ParentRequest & {
  contact: string;
};

type AdminJoinApplication = JoinApplication & {
  demand?: AdminDemand;
};

type AdminData = {
  configured: boolean;
  demands: AdminDemand[];
  joinApplications: AdminJoinApplication[];
};

const actionLabels: Record<string, string> = {
  "approve-demand": "通过需求",
  "reject-demand": "拒绝需求",
  "approve-join": "通过加入",
  "reject-join": "拒绝加入",
  "complete-demand": "标记已成团",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const pendingDemands = useMemo(
    () => data?.demands.filter((demand) => demand.status === "pending") ?? [],
    [data],
  );
  const pendingJoins = useMemo(
    () => data?.joinApplications.filter((application) => application.status === "pending") ?? [],
    [data],
  );
  const activeDemands = useMemo(
    () => data?.demands.filter((demand) => demand.status === "active") ?? [],
    [data],
  );
  const fullPendingDemands = useMemo(
    () => data?.demands.filter((demand) => demand.status === "full_pending") ?? [],
    [data],
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData(password);
  }

  async function loadData(nextPassword = storedPassword) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/data", {
      headers: { "x-admin-password": nextPassword },
      cache: "no-store",
    });
    setLoading(false);

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setMessage(result?.message ?? "读取失败，请检查管理员密码。");
      return;
    }

    const result = (await response.json()) as AdminData;
    setStoredPassword(nextPassword);
    setData(result);
  }

  async function runAction(action: string, id: string) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": storedPassword,
      },
      body: JSON.stringify({ action, id }),
    });
    setLoading(false);

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setMessage(result?.message ?? "操作失败，请稍后再试。");
      return;
    }

    setMessage(`${actionLabels[action] ?? "操作"}成功`);
    await loadData(storedPassword);
  }

  if (!storedPassword || !data) {
    return (
      <main className="page-shell">
        <section className="soft-card p-6">
          <p className="text-sm font-semibold text-muted">管理员入口</p>
          <h1 className="mt-1 text-3xl font-black text-coffee">拼好课审核台</h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-taupe">
            输入管理员密码后，可以审核发布需求和加入意向。普通用户不需要登录。
          </p>
          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <label className="block">
              <span className="field-label">管理员密码</span>
              <input
                className="field-control"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入管理员密码"
                required
              />
            </label>
            {message ? <Message>{message}</Message> : null}
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-5 py-3 text-base font-bold text-white shadow-glow disabled:bg-muted disabled:shadow-none"
              disabled={loading}
            >
              {loading ? "进入中..." : "进入审核台"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">管理员入口</p>
          <h1 className="mt-1 text-3xl font-black text-coffee">拼好课审核台</h1>
        </div>
        <button
          type="button"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary ring-1 ring-border"
          onClick={() => loadData()}
          disabled={loading}
        >
          刷新
        </button>
      </header>

      {!data.configured ? (
        <Message>还没有配置 Supabase 环境变量。请先创建数据表并配置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY。</Message>
      ) : null}
      {message ? <Message>{message}</Message> : null}

      <section className="grid grid-cols-2 gap-3">
        <CountCard label="待审核需求" value={pendingDemands.length} />
        <CountCard label="待确认加入" value={pendingJoins.length} />
        <CountCard label="待拼中需求" value={activeDemands.length} />
        <CountCard label="已满员待建联" value={fullPendingDemands.length} />
      </section>

      <AdminSection title="待审核需求" empty="暂无待审核需求">
        {pendingDemands.map((demand) => (
          <DemandAdminCard
            key={demand.id}
            demand={demand}
            actions={
              <>
                <ActionButton onClick={() => runAction("approve-demand", demand.id)}>通过</ActionButton>
                <ActionButton variant="light" onClick={() => runAction("reject-demand", demand.id)}>
                  拒绝
                </ActionButton>
              </>
            }
          />
        ))}
      </AdminSection>

      <AdminSection title="待确认加入" empty="暂无待确认加入">
        {pendingJoins.map((application) => (
          <JoinAdminCard
            key={application.id}
            application={application}
            actions={
              <>
                <ActionButton onClick={() => runAction("approve-join", application.id)}>通过匹配</ActionButton>
                <ActionButton variant="light" onClick={() => runAction("reject-join", application.id)}>
                  拒绝
                </ActionButton>
              </>
            }
          />
        ))}
      </AdminSection>

      <AdminSection title="已满员待建联" empty="暂无已满员待建联需求">
        {fullPendingDemands.map((demand) => {
          const approvedContacts = data.joinApplications.filter(
            (application) => application.demandId === demand.id && application.status === "approved",
          );
          return (
            <DemandAdminCard
              key={demand.id}
              demand={demand}
              extra={
                <div className="mt-3 rounded-[18px] bg-hero px-3 py-3 text-sm font-semibold leading-relaxed text-taupe ring-1 ring-border">
                  <p>发起人联系方式：{demand.contact}</p>
                  <p className="mt-1">
                    已通过加入联系方式：
                    {approvedContacts.length > 0
                      ? approvedContacts.map((application) => application.contact).join("、")
                      : "暂无"}
                  </p>
                  <p className="mt-1">
                    人数：目前{demand.currentPeople}人｜目标{demand.targetPeople}人
                  </p>
                </div>
              }
              actions={<ActionButton onClick={() => runAction("complete-demand", demand.id)}>标记已成团</ActionButton>}
            />
          );
        })}
      </AdminSection>
    </main>
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <section className="soft-card p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-primary">{value}</p>
    </section>
  );
}

function AdminSection({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <section className="mt-5">
      <h2 className="mb-3 text-xl font-black text-primary">{title}</h2>
      {hasChildren ? <div className="space-y-3">{children}</div> : <EmptyCard>{empty}</EmptyCard>}
    </section>
  );
}

function DemandAdminCard({
  demand,
  actions,
  extra,
}: {
  demand: AdminDemand;
  actions: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <article className="soft-card p-4">
      <h3 className="text-base font-black leading-snug text-coffee">
        {demand.area}｜{demand.ageRange}｜{demand.courseCategory}｜{demand.courseDetail}
      </h3>
      <div className="mt-3 space-y-1 text-sm font-semibold leading-relaxed text-taupe">
        <p>
          {demand.availableTime}｜{demand.duration}｜{demand.budget}
        </p>
        <p>
          目前{demand.currentPeople}人｜目标{demand.targetPeople}人
        </p>
        <p>联系方式：{demand.contact}</p>
        <p>补充说明：{demand.note || "无"}</p>
        <p>提交时间：{formatTime(demand.createdAt)}</p>
      </div>
      {extra}
      <div className="mt-4 flex gap-2">{actions}</div>
    </article>
  );
}

function JoinAdminCard({
  application,
  actions,
}: {
  application: AdminJoinApplication;
  actions: React.ReactNode;
}) {
  const demand = application.demand;
  return (
    <article className="soft-card p-4">
      <h3 className="text-base font-black leading-snug text-coffee">
        {demand
          ? `${demand.area}｜${demand.ageRange}｜${demand.courseDetail}`
          : `需求 ID：${application.demandId}`}
      </h3>
      <div className="mt-3 space-y-1 text-sm font-semibold leading-relaxed text-taupe">
        {demand ? (
          <p>
            {demand.availableTime}｜{demand.duration}｜{demand.budget}｜目前{demand.currentPeople}人｜目标
            {demand.targetPeople}人
          </p>
        ) : null}
        <p>加入年龄段：{application.ageRange}</p>
        <p>可接受时间：{application.acceptableTime}</p>
        <p>联系方式：{application.contact}</p>
        <p>补充说明：{application.note || "无"}</p>
        <p>提交时间：{formatTime(application.createdAt)}</p>
      </div>
      <div className="mt-4 flex gap-2">{actions}</div>
    </article>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "dark",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      className={
        variant === "dark"
          ? "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-glow"
          : "rounded-full bg-white px-4 py-2 text-sm font-bold text-primary ring-1 ring-border"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return <section className="soft-card p-4 text-sm font-semibold text-taupe">{children}</section>;
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 rounded-[20px] bg-hero px-4 py-3 text-sm font-semibold leading-relaxed text-taupe ring-1 ring-border">
      {children}
    </p>
  );
}

function formatTime(value?: string) {
  if (!value) return "未知";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
