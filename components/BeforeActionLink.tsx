"use client";

import Link from "next/link";
import { MouseEvent, useState } from "react";

type BeforeActionLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function BeforeActionLink({ href, children, className, ariaLabel }: BeforeActionLinkProps) {
  const [open, setOpen] = useState(false);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.localStorage.getItem("pin-lesson-action-notice-seen") === "true") return;
    event.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <Link href={href} aria-label={ariaLabel} className={className} onClick={handleClick}>
        {children}
      </Link>

      {open ? (
        <div className="fixed inset-0 z-30 flex items-end bg-primary/35 px-4 pb-5 pt-10 backdrop-blur-sm">
          <section className="mx-auto w-full max-w-[430px] rounded-[30px] bg-white p-5 shadow-float">
            <h2 className="text-2xl font-black text-primary">拼课前请了解</h2>
            <p className="mt-4 whitespace-pre-line text-sm font-medium leading-relaxed text-taupe">
              拼好课只帮你匿名发布和匹配拼课意向。{"\n"}联系方式不会公开，人数凑齐并确认后，平台再代为转达或协助建群。{"\n"}后续报名、付款、上课和退费，请家长自行与机构确认。{"\n"}报名前请核实课程机构和费用规则，不要提前向陌生人转账。
            </p>
            <Link
              href={href}
              className="mt-5 block rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-glow"
              onClick={() => {
                window.localStorage.setItem("pin-lesson-action-notice-seen", "true");
                setOpen(false);
              }}
            >
              我知道了，继续
            </Link>
          </section>
        </div>
      ) : null}
    </>
  );
}
