create table if not exists demands (
  id text primary key,
  area text not null,
  "ageRange" text not null,
  "courseCategory" text not null,
  "courseDetail" text not null,
  "courseGoal" text not null,
  "availableTime" text not null,
  duration text not null,
  "currentPeople" integer not null,
  "targetPeople" integer not null,
  budget text not null,
  contact text not null,
  note text not null default '',
  status text not null check (status in ('pending', 'active', 'full_pending', 'completed', 'expired', 'rejected')),
  "createdAt" timestamptz not null default now(),
  "expiresAt" timestamptz not null
);

create table if not exists "joinApplications" (
  id text primary key,
  "demandId" text not null references demands(id) on delete cascade,
  "ageRange" text not null,
  "acceptableTime" text not null,
  contact text not null,
  note text not null default '',
  status text not null check (status in ('pending', 'approved', 'rejected')),
  "createdAt" timestamptz not null default now()
);

create index if not exists demands_status_idx on demands(status);
create index if not exists demands_created_at_idx on demands("createdAt" desc);
create index if not exists join_applications_status_idx on "joinApplications"(status);
create index if not exists join_applications_demand_id_idx on "joinApplications"("demandId");

insert into demands (
  id, area, "ageRange", "courseCategory", "courseDetail", "courseGoal",
  "availableTime", duration, "currentPeople", "targetPeople", budget,
  contact, note, status, "createdAt", "expiresAt"
) values
  (
    'kejiyuan-swim', '科技园', '4-5岁', '游泳', '游泳启蒙', '体验试课',
    '周六上午', '1小时', 1, 4, '人均150-200元/节',
    'mock-contact-1', '希望离地铁近，先体验课。', 'active', now(), now() + interval '7 days'
  ),
  (
    'houhai-art', '后海', '5-6岁', '美术', '创意美术', '兴趣培养',
    '周日下午', '1.5小时', 2, 4, '人均100-150元/节',
    'mock-contact-2', '想找轻松一点的体验，最好同小区附近。', 'active', now(), now() + interval '5 days'
  ),
  (
    'shekou-basketball', '蛇口', '6-8岁', '篮球', '篮球基础', '兴趣培养',
    '周日上午', '1小时', 1, 6, '人均100-150元/节',
    'mock-contact-3', '希望户外场地近一点，孩子刚开始接触。', 'active', now(), now() + interval '6 days'
  ),
  (
    'xili-fitness', '西丽', '4-6岁', '体适能', '综合体能', '兴趣培养',
    '周六下午', '45分钟', 2, 4, '人均150-200元/节',
    'mock-contact-4', '不想太远，最好可先试一次。', 'active', now(), now() + interval '3 days'
  ),
  (
    'nanyou-dance', '南油', '5-6岁', '舞蹈', '中国舞', '系统学习',
    '工作日晚', '1小时', 4, 4, '人均200-300元/节',
    'mock-contact-5', '等待平台确认参与意向。', 'full_pending', now(), now() + interval '2 days'
  ),
  (
    'qianhai-lego', '前海', '6-8岁', '乐高科创', '乐高/科创', '兴趣培养',
    '周日下午', '1.5小时', 3, 6, '人均200-300元/节',
    'mock-contact-6', '想找同年龄孩子一起，偏动手和科创实验。', 'active', now(), now() + interval '4 days'
  )
on conflict (id) do nothing;
