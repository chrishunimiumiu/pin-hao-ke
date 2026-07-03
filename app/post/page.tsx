"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ConsentChecks } from "@/components/ConsentChecks";
import {
  ageRanges,
  areas,
  budgetOptions,
  courseCategories,
  courseDetailOptions,
  courseGoals,
  currentPeopleOptions,
  durationOptions,
  targetPeopleOptions,
  timeOptions,
} from "@/lib/requests";

function SelectField({
  label,
  name,
  options,
  required = true,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select
        className="field-control"
        name={name}
        required={required}
        value={value}
        defaultValue={value === undefined ? "" : undefined}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      >
        <option value="" disabled>
          请选择
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PostPage() {
  const [submitted, setSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [courseCategory, setCourseCategory] = useState("");
  const [courseDetail, setCourseDetail] = useState("");
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const [contactAccepted, setContactAccepted] = useState(false);
  const [showConsentMessage, setShowConsentMessage] = useState(false);

  const detailOptions = useMemo(
    () => courseDetailOptions[courseCategory] ?? [],
    [courseCategory],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPeople = Number(String(formData.get("currentPeople")).replace("人", ""));
    const targetPeople = Number(String(formData.get("targetPeople")).replace("人", ""));

    if (currentPeople >= targetPeople) {
      setValidationMessage("目标人数要大于当前人数，这样才方便继续找拼课搭子哦。");
      return;
    }

    if (!noticeAccepted || !contactAccepted) {
      setShowConsentMessage(true);
      return;
    }

    setValidationMessage("");
    setSubmitMessage("");
    setShowConsentMessage(false);
    setSubmitting(true);

    const response = await fetch("/api/demands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area: formData.get("area"),
        ageRange: formData.get("ageRange"),
        courseCategory: formData.get("courseCategory"),
        courseDetail: formData.get("courseDetail"),
        courseGoal: formData.get("courseGoal"),
        availableTime: formData.get("availableTime"),
        duration: formData.get("duration"),
        currentPeople,
        targetPeople,
        budget: formData.get("budget"),
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
          <p className="text-sm font-semibold text-muted">匿名发布</p>
          <h1 className="mt-1 text-3xl font-black text-coffee">发布拼课需求</h1>
        </div>
        <Link href="/" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary ring-1 ring-border">
          返回
        </Link>
      </header>

      {submitted ? (
        <section className="soft-card p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blobmint text-2xl font-black text-primary">
            好
          </div>
          <h2 className="mt-5 text-2xl font-black text-coffee">提交成功</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-taupe">
            我们会先审核需求，再匿名展示到需求墙。{"\n"}审核前不会公开你的联系方式。
          </p>
          <Link
            href="/"
            className="mt-6 block rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-glow"
          >
            回到需求墙
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="soft-card space-y-5 p-5">
          <SelectField label="区域" name="area" options={areas} />
          <SelectField label="年龄段" name="ageRange" options={ageRanges} />
          <SelectField
            label="课程类别"
            name="courseCategory"
            options={courseCategories}
            value={courseCategory}
            onChange={(value) => {
              setCourseCategory(value);
              setCourseDetail("");
            }}
          />
          <SelectField
            label="课程细分"
            name="courseDetail"
            options={detailOptions}
            value={courseDetail}
            onChange={setCourseDetail}
          />
          <SelectField label="课程目标" name="courseGoal" options={courseGoals} />
          <SelectField label="可上课时间" name="availableTime" options={timeOptions} />
          <SelectField label="课时区间" name="duration" options={durationOptions} />
          <SelectField label="当前人数" name="currentPeople" options={currentPeopleOptions} />
          <SelectField label="目标人数" name="targetPeople" options={targetPeopleOptions} />
          <SelectField label="预算｜人均每节" name="budget" options={budgetOptions} />

          {validationMessage ? (
            <p className="rounded-2xl bg-lego px-3 py-2 text-sm font-semibold leading-relaxed text-primary">
              {validationMessage}
            </p>
          ) : null}

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

          {submitMessage ? (
            <p className="rounded-2xl bg-lego px-3 py-2 text-sm font-semibold leading-relaxed text-primary">
              {submitMessage}
            </p>
          ) : null}

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

          <button
            type="submit"
            className="w-full rounded-full bg-primary px-5 py-3 text-base font-bold text-white shadow-glow transition disabled:bg-muted disabled:shadow-none active:scale-[0.98]"
            disabled={!noticeAccepted || !contactAccepted || submitting}
            onClick={() => {
              if (!noticeAccepted || !contactAccepted) setShowConsentMessage(true);
            }}
          >
            {submitting ? "提交中..." : "提交需求"}
          </button>
        </form>
      )}
    </main>
  );
}
