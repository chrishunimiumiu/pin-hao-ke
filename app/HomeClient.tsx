"use client";

import { useMemo, useState } from "react";
import { BeforeActionLink } from "@/components/BeforeActionLink";
import { RequestCard } from "@/components/RequestCard";
import { ageRanges, areas, courseCategories, type ParentRequest } from "@/lib/requests";

type FilterType = "all" | "area" | "age" | "course";

const filterTabs: Array<{ key: FilterType; label: string }> = [
  { key: "all", label: "全部" },
  { key: "area", label: "区域" },
  { key: "age", label: "年龄" },
  { key: "course", label: "课程" },
];

export function HomeClient({ requests }: { requests: ParentRequest[] }) {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterValue, setFilterValue] = useState("全部");

  const filterOptions = useMemo(() => {
    if (filterType === "area") return ["全部", ...areas];
    if (filterType === "age") return ["全部", ...ageRanges];
    if (filterType === "course") return ["全部", ...courseCategories];
    return [];
  }, [filterType]);

  const filteredRequests = useMemo(() => {
    if (filterType === "all" || filterValue === "全部") return requests;
    if (filterType === "area") return requests.filter((request) => request.area === filterValue);
    if (filterType === "age") return requests.filter((request) => request.ageRange === filterValue);
    return requests.filter((request) => request.courseCategory === filterValue);
  }, [filterType, filterValue, requests]);

  function selectFilterType(nextType: FilterType) {
    setFilterType(nextType);
    setFilterValue("全部");
  }

  return (
    <main className="page-shell relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 top-20 h-36 w-36 rounded-full bg-blobpink blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-32 h-40 w-40 rounded-full bg-bloblavender blur-3xl" />
      <div className="pointer-events-none absolute -left-10 top-[430px] h-32 w-32 rounded-full bg-blobyellow/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-[620px] h-36 w-36 rounded-full bg-blobmint blur-3xl" />

      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-glow">
            拼
          </div>
          <span className="text-xl font-black text-primary">拼好课</span>
        </div>
        <BeforeActionLink
          href="/post"
          ariaLabel="发起拼课"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xl font-bold leading-none text-white shadow-glow transition active:scale-[0.98]"
        >
          +
        </BeforeActionLink>
      </header>

      <section className="relative overflow-hidden rounded-[36px] border border-border bg-hero px-5 py-6 shadow-float">
        <div className="absolute right-5 top-5 flex gap-2">
          <span className="h-5 w-5 rounded-full bg-swim" />
          <span className="h-5 w-5 rounded-full bg-art" />
          <span className="h-5 w-5 rounded-full bg-lego" />
        </div>
        <div className="pointer-events-none absolute -bottom-4 right-1 h-10 w-10 rounded-2xl bg-dance/40" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-blobmint/40" />
        <p className="relative z-10 text-sm font-bold text-muted">🌱 南山家长拼课基地</p>
        <h1 className="relative z-10 mt-4 text-[26px] font-black leading-tight tracking-normal text-primary">
          帮家长找
          <br />
          <span className="whitespace-nowrap">同城兴趣班拼课搭子</span>
        </h1>
        <p className="relative z-10 mt-4 whitespace-pre-line text-[15px] font-semibold leading-relaxed text-taupe">
          想给孩子报兴趣班，找不到人一起拼课？{"\n"}匿名发布需求，看看附近有没有同区域、同年龄、同时间的家长。
        </p>
        <p className="relative z-10 mt-3 text-[15px] font-semibold leading-relaxed text-taupe">
          不是每个家长都社牛，但每个家长都想拼到优惠课。
        </p>
      </section>

      <p className="mt-3 rounded-full border border-border bg-white px-3.5 py-2 text-center text-xs font-medium leading-relaxed text-taupe shadow-soft">
        🔒 联系方式不公开，满员后由平台代为转达。
      </p>
      <p className="mt-2 rounded-[20px] border border-border bg-white/86 px-3.5 py-2 text-xs font-medium leading-relaxed text-taupe shadow-soft">
        平台只做拼课意向撮合，不参与后续课程交易与履约。
      </p>

      <BeforeActionLink
        href="/post"
        className="mt-3 block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-bold text-white shadow-glow transition active:scale-[0.98]"
      >
        发布拼课需求
      </BeforeActionLink>

      <section className="mt-4">
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-primary">兴趣班拼课需求墙</h2>
            <p className="mt-1 text-xs leading-relaxed text-taupe">
              看看有没有同区域、同年龄、同时间的家长。
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-soft ring-1 ring-border">
            共 {filteredRequests.length} 条
          </span>
        </div>

        <div className="mb-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  filterType === tab.key
                    ? "bg-primary text-white shadow-soft"
                    : "bg-white text-taupe ring-1 ring-border"
                }`}
                onClick={() => selectFilterType(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filterOptions.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    filterValue === option
                      ? "bg-hero text-primary ring-1 ring-primary"
                      : "bg-white/88 text-muted ring-1 ring-border"
                  }`}
                  onClick={() => setFilterValue(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {filteredRequests.length > 0 ? (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <section className="soft-card p-5 text-center">
            <h3 className="text-lg font-black text-primary">暂时没有匹配的拼课需求</h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-taupe">
              你可以先发布一个需求，等同路家长来找你。
            </p>
            <BeforeActionLink
              href="/post"
              className="mt-4 block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-bold text-white shadow-glow"
            >
              发布拼课需求
            </BeforeActionLink>
          </section>
        )}
      </section>
    </main>
  );
}
