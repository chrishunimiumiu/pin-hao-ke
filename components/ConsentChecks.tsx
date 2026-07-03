"use client";

import { useState } from "react";
import { CourseNotice } from "@/components/CourseNotice";

type ConsentChecksProps = {
  noticeAccepted: boolean;
  contactAccepted: boolean;
  showMessage: boolean;
  onNoticeChange: (checked: boolean) => void;
  onContactChange: (checked: boolean) => void;
};

export function ConsentChecks({
  noticeAccepted,
  contactAccepted,
  showMessage,
  onNoticeChange,
  onContactChange,
}: ConsentChecksProps) {
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <div className="space-y-3 rounded-[24px] bg-hero px-4 py-4 ring-1 ring-border">
      <label className="flex gap-3 text-sm font-semibold leading-relaxed text-primary">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-primary"
          checked={noticeAccepted}
          onChange={(event) => onNoticeChange(event.target.checked)}
        />
        <span>
          我已阅读并同意
          <button
            type="button"
            className="font-black underline underline-offset-4"
            onClick={() => setNoticeOpen(true)}
          >
            《拼课须知》
          </button>
        </span>
      </label>

      <label className="flex gap-3 text-sm font-semibold leading-relaxed text-primary">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-primary"
          checked={contactAccepted}
          onChange={(event) => onContactChange(event.target.checked)}
        />
        <span>我同意平台在匹配成功后，代为转达我的联系方式，仅用于本次拼课沟通</span>
      </label>

      {showMessage && (!noticeAccepted || !contactAccepted) ? (
        <p className="rounded-2xl bg-blobyellow/80 px-3 py-2 text-xs font-semibold leading-relaxed text-primary">
          请先阅读并同意《拼课须知》和联系方式代转说明。
        </p>
      ) : null}

      <CourseNotice open={noticeOpen} onClose={() => setNoticeOpen(false)} />
    </div>
  );
}
