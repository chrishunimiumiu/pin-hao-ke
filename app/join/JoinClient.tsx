"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ConsentChecks } from "@/components/ConsentChecks";
import { getPublicStatus, getRemainingPeople } from "@/components/RequestCard";
import { ageRanges, formatCourseName, timeOptions, type ParentRequest } from "@/lib/requests";

export function JoinClient({ request }: { request: ParentRequest | null }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const [contactAccepted, setContactAccepted] = useState(false);
  const [showConsentMessage, setShowConsentMessage] = useState(false);

  if (!request) {
    return (
      <main className="page-shell">
        <section className="soft-card p-6 text-center">
          <h1 className="text-2xl font-black text-coffee">没有找到这条需求</h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-taupe">
            这条需求可能还在审核中，或暂时不可加入。
          </p>
          <Link
            href="/"
            className="mt-6 block rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-glow"
          >
            回到需求墙
          </Link>
        </section>
      </main>
    );
  }

  const activeRequest = request;
  const remainingPeople = getRemainingPeople(request);
  const publicStatus = getPublicStatus(request.status, remainingPeople, request.currentPeople, request.targetPeople);
  const actionDisabled = ["已满员", "确认中", "已成团", "已过期"].includes(publicStatus);
  const defaultAgeRange = ageRanges.includes(request.ageRange) ? request.ageRange : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!noticeAccepted || !contactAccepted) {
      setShowConsentMessage(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    setShowConsentMessage(false);
    setSubmitMessage("");
    setSubmitting(true);

    const response = await fetch("/api/join-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        demandId: activeRequest.id,
        ageRange: formData.get("ageRange"),
        acceptableTime: formData.get("acceptableTime"),
        contact: formData.get("contact"),
        note: formData.get("note"),
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setSubmitMessage(result?.message ?? "提交失败，请稍后再试。");
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="page-shell">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">加入意向</p>
          <h1 className="mt-1 text-3xl font-black text-coffee">我也想拼</h1>
        </div>
        <Link href="/" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary ring-1 ring-border">
          返回
        </Link>
      </header>

      <section className="soft-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold text-muted">你想加入：</p>
            <h2 className="break-words text-lg font-black leading-snug text-coffee">
              {request.area}｜{request.ageRange}｜{formatCourseName(request.courseCategory, request.courseDetail)}
            </h2>
            <div className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-taupe">
              <p>{request.availableTime}｜{request.duration}｜{request.budget}</p>
              <p>目前{request.currentPeople}人｜目标{request.targetPeople}人｜差{remainingPeople}人</p>
              <p>成团剩余：{request.daysLeft}天</p>
              <p>补充：{request.note}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getBadgeClass(publicStatus)}`}>
            {publicStatus}
          </span>
        </div>
      </section>

      {actionDisabled ? (
        <section className="soft-card mt-5 p-5">
          <h2 className="text-xl font-black text-primary">{publicStatus}</h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-taupe">
            {getDisabledMessage(publicStatus)}
          </p>
          <Link
            href="/"
            className="mt-5 block rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-glow"
          >
            回到需求墙
          </Link>
        </section>
      ) : submitted ? (
        <section className="soft-card mt-5 p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blobmint text-2xl font-black text-primary">
            收
          </div>
          <h2 className="mt-5 text-2xl font-black text-coffee">已收到你的加入意向</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-taupe">
            我们会先确认时间、年龄和课程是否匹配。{"\n"}匹配确认后，这条需求的人数才会更新。{"\n"}你的联系方式不会公开展示。
          </p>
          <Link
            href="/"
            className="mt-6 block rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-glow"
          >
            回到需求墙
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="soft-card mt-5 space-y-5 p-5">
          <label className="block">
            <span className="field-label">年龄段</span>
            <select className="field-control" name="ageRange" required defaultValue={defaultAgeRange}>
              <option value="" disabled>
                请选择
              </option>
              {ageRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">可接受时间</span>
            <select className="field-control" name="acceptableTime" required defaultValue={request.availableTime}>
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">联系方式｜仅平台可见</span>
            <input
              className="field-control"
              name="contact"
              required
              placeholder="微信 / 手机号均可，仅用于匹配后联系，不公开展示。"
            />
          </label>

          <label className="block">
            <span className="field-label">补充说明</span>
            <textarea
              className="field-control min-h-24 resize-none"
              name="note"
              placeholder="比如：希望离地铁近、想先试课、只考虑周末、偏启蒙、不想太远等。"
            />
          </label>

          <section className="rounded-[24px] bg-hero px-4 py-4 text-sm leading-relaxed text-taupe ring-1 ring-border">
            <p>需求默认展示 7 天，未成团自动下架。</p>
            <p className="mt-2">匹配成功后，平台会先确认意向，再代转联系方式。</p>
            <p className="mt-2">后续报名、付款、退费等由参与方自行沟通。</p>
          </section>

          <ConsentChecks
            noticeAccepted={noticeAccepted}
            contactAccepted={contactAccepted}
            showMessage={showConsentMessage}
            onNoticeChange={setNoticeAccepted}
            onContactChange={setContactAccepted}
          />

          {submitMessage ? (
            <p className="rounded-2xl bg-lego px-3 py-2 text-sm font-semibold leading-relaxed text-primary">
              {submitMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-primary px-5 py-3 text-base font-bold text-white shadow-glow transition disabled:bg-muted disabled:shadow-none active:scale-[0.98]"
            disabled={!noticeAccepted || !contactAccepted || submitting}
            onClick={() => {
              if (!noticeAccepted || !contactAccepted) setShowConsentMessage(true);
            }}
          >
            {submitting ? "提交中..." : "提交加入意向"}
          </button>
        </form>
      )}
    </main>
  );
}

function getBadgeClass(status: string) {
  if (status === "已过期" || status === "已成团") return "bg-done text-muted";
  if (status === "已满员" || status === "确认中") return "bg-blobmint text-primary";
  return "bg-lego text-primary";
}

function getDisabledMessage(status: string) {
  if (status === "已成团") return "这条需求已完成成团，平台已协助匹配家长建联。联系方式不会公开展示。";
  if (status === "已过期") return "这条需求已超过展示有效期，暂时不能继续提交加入意向。";
  return "已满员，平台将代为确认并联系匹配家长。联系方式不会公开展示。平台确认后将代为转达联系方式或协助建群。";
}
