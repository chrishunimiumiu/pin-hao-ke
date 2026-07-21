import { BeforeActionLink } from "@/components/BeforeActionLink";
import { formatCourseName, type DemandStatus, type ParentRequest } from "@/lib/requests";

type RequestCardProps = {
  request: ParentRequest;
};

export function RequestCard({ request }: RequestCardProps) {
  const remainingPeople = getRemainingPeople(request);
  const displayStatus = request.daysLeft <= 0 ? "expired" : request.status;
  const publicStatus = getPublicStatus(displayStatus, remainingPeople, request.currentPeople, request.targetPeople);
  const actionDisabled = ["已满员", "确认中", "已成团", "已过期"].includes(publicStatus);
  const badgeClass = getBadgeClass(publicStatus);

  return (
    <article className="soft-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3.5">
          <span className={`mt-1 h-4 w-4 shrink-0 rounded-[6px] ${getCategoryClass(request.courseCategory)}`} />
          <div className="min-w-0">
            <h3 className="break-words text-base font-black leading-snug text-coffee">
              {request.area}｜{request.ageRange}｜{formatCourseName(request.courseCategory, request.courseDetail)}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-taupe">
              {request.availableTime}｜{request.duration}｜{request.budget}
            </p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {publicStatus}
        </span>
      </div>

      <div className="ml-8 mt-3 text-sm font-semibold leading-relaxed text-taupe">
        <p>{getPeopleLine(publicStatus, request.currentPeople, request.targetPeople, request.daysLeft)}</p>
      </div>

      {publicStatus === "已满员" || publicStatus === "确认中" ? (
        <p className="ml-8 mt-3 rounded-[20px] bg-hero px-3 py-2 text-xs font-semibold leading-relaxed text-taupe ring-1 ring-border">
          已凑齐目标人数，平台正在确认意向。平台确认后将代为转达联系方式或协助建群。
        </p>
      ) : null}

      {!actionDisabled ? (
        <BeforeActionLink
          href={`/join?id=${request.id}`}
          className="ml-8 mt-3 inline-flex rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-[0.98]"
        >
          我也想拼 →
        </BeforeActionLink>
      ) : null}
    </article>
  );
}

export function getRemainingPeople(request: Pick<ParentRequest, "targetPeople" | "currentPeople">) {
  return Math.max(request.targetPeople - request.currentPeople, 0);
}

export function getPublicStatus(
  status: DemandStatus,
  remainingPeople: number,
  currentPeople: number,
  targetPeople: number,
) {
  if (status === "expired") return "已过期";
  if (status === "completed") return "已成团";
  if (status === "full_pending" || currentPeople >= targetPeople) return "已满员";
  return `差${remainingPeople}人`;
}

function getBadgeClass(status: string) {
  if (status === "已过期" || status === "已成团") return "bg-done text-muted";
  if (status === "已满员" || status === "确认中") return "bg-blobmint text-primary";
  return "bg-lego text-primary";
}

function getPeopleLine(
  status: string,
  currentPeople: number,
  targetPeople: number,
  daysLeft: number,
) {
  if (status === "已满员" || status === "确认中") return `目前${currentPeople}人｜目标${targetPeople}人｜平台确认中`;
  if (status === "已成团") return `目前${currentPeople}人｜目标${targetPeople}人｜已成团`;
  if (status === "已过期") return `目前${currentPeople}人｜目标${targetPeople}人｜已过期`;
  return `目前${currentPeople}人｜目标${targetPeople}人｜成团剩余${daysLeft}天`;
}

function getCategoryClass(courseCategory: string) {
  if (courseCategory.includes("游泳")) return "bg-swim";
  if (courseCategory.includes("美术")) return "bg-art";
  if (courseCategory.includes("体适能") || courseCategory.includes("篮球")) return "bg-fitness";
  if (courseCategory.includes("舞蹈")) return "bg-dance";
  if (courseCategory.includes("乐高") || courseCategory.includes("科创")) return "bg-lego";
  return "bg-othercat";
}
