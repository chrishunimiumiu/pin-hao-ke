"use client";

type CourseNoticeProps = {
  open: boolean;
  onClose: () => void;
};

export function CourseNotice({ open, onClose }: CourseNoticeProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-primary/35 px-4 pb-5 pt-10 backdrop-blur-sm">
      <section className="mx-auto flex max-h-[86vh] w-full max-w-[430px] flex-col rounded-[30px] bg-white shadow-float">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-2xl font-black text-primary">拼课须知</h2>
        </div>
        <div className="space-y-3 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-taupe">
          <NoticeItem title="1. 平台角色">
            拼好课仅提供拼课意向展示、需求匹配、联系方式代转或协助建群服务，不直接提供课程服务。
          </NoticeItem>
          <NoticeItem title="2. 信息与隐私">
            拼课需求会匿名展示在需求墙中。联系方式不会公开展示，仅平台可见，并仅用于本次拼课沟通。
          </NoticeItem>
          <NoticeItem title="3. 满员后建联">
            当人数达到目标人数后，平台会先确认参与意向，再代为转达联系方式或协助建群。
          </NoticeItem>
          <NoticeItem title="4. 成团后责任">
            平台完成联系方式代转或协助建群后，本次信息撮合服务即视为完成。后续报名、付款、上课、退费、取消、改期及争议处理，由参与家长与课程机构自行沟通确认。
          </NoticeItem>
          <NoticeItem title="5. 课程与安全提示">
            平台不对第三方课程机构的资质、课程质量、师资水平、价格优惠或最终履约作出承诺。报名前请自行核实机构、费用、时间、退费规则和安全保障，请勿提前向陌生人转账。
          </NoticeItem>
        </div>
        <div className="border-t border-border p-4">
          <button
            type="button"
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-glow"
            onClick={onClose}
          >
            我知道了
          </button>
        </div>
      </section>
    </div>
  );
}

function NoticeItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] bg-hero px-3 py-3 ring-1 ring-border/70">
      <h3 className="font-black text-primary">{title}</h3>
      <p className="mt-1">{children}</p>
    </section>
  );
}
