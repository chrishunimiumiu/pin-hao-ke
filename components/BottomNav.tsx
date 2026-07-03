import Link from "next/link";

type BottomNavProps = {
  active: "home" | "post";
};

export function BottomNav({ active }: BottomNavProps) {
  const items = [
    { key: "home", href: "/", label: "需求墙" },
    { key: "post", href: "/post", label: "发布需求" },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-10 px-4">
      <div className="mx-auto grid w-full max-w-[300px] grid-cols-2 gap-1 rounded-full bg-primary p-1 shadow-glow">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-full px-2.5 py-1.5 text-center text-xs font-semibold transition ${
              active === item.key
                ? "bg-white text-primary shadow-sm"
                : "text-white/68"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
