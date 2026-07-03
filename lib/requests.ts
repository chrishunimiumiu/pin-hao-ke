export type DemandStatus =
  | "pending"
  | "active"
  | "full_pending"
  | "completed"
  | "expired"
  | "rejected";

export type ParentRequest = {
  id: string;
  area: string;
  ageRange: string;
  courseCategory: string;
  courseDetail: string;
  courseGoal: string;
  availableTime: string;
  duration: string;
  currentPeople: number;
  targetPeople: number;
  budget: string;
  daysLeft: number;
  expiresAt: string;
  note: string;
  status: DemandStatus;
  createdAt?: string;
};

export type JoinApplicationStatus = "pending" | "approved" | "rejected";

export type JoinApplication = {
  id: string;
  demandId: string;
  ageRange: string;
  acceptableTime: string;
  contact: string;
  note: string;
  status: JoinApplicationStatus;
  createdAt: string;
  demand?: ParentRequest;
};

const genericCourseDetails = ["启蒙", "基础", "提升", "私教拼课", "其他"];

export function formatCourseName(courseCategory: string, courseDetail: string) {
  const category = courseCategory.trim();
  const detail = courseDetail.trim();

  if (!category) return detail;
  if (!detail || detail === "其他") return category;
  if (detail.includes(category) || category.includes(detail)) return detail;
  if (genericCourseDetails.includes(detail)) return `${category}${detail}`;

  return detail;
}

export const parentRequests: ParentRequest[] = [
  {
    id: "kejiyuan-swim",
    area: "科技园",
    ageRange: "4-5岁",
    courseCategory: "游泳",
    courseDetail: "游泳启蒙",
    courseGoal: "体验试课",
    availableTime: "周六上午",
    duration: "1小时",
    currentPeople: 1,
    targetPeople: 4,
    budget: "人均150-200元/节",
    daysLeft: 7,
    expiresAt: "7月03日",
    note: "希望离地铁近，先体验课。",
    status: "active",
  },
  {
    id: "houhai-art",
    area: "后海",
    ageRange: "5-6岁",
    courseCategory: "美术",
    courseDetail: "创意美术",
    courseGoal: "兴趣培养",
    availableTime: "周日下午",
    duration: "1.5小时",
    currentPeople: 2,
    targetPeople: 4,
    budget: "人均100-150元/节",
    daysLeft: 5,
    expiresAt: "7月01日",
    note: "想找轻松一点的体验，最好同小区附近。",
    status: "active",
  },
  {
    id: "shekou-basketball",
    area: "蛇口",
    ageRange: "6-8岁",
    courseCategory: "篮球",
    courseDetail: "篮球基础",
    courseGoal: "兴趣培养",
    availableTime: "周日上午",
    duration: "1小时",
    currentPeople: 1,
    targetPeople: 6,
    budget: "人均100-150元/节",
    daysLeft: 6,
    expiresAt: "7月02日",
    note: "希望户外场地近一点，孩子刚开始接触。",
    status: "active",
  },
  {
    id: "xili-fitness",
    area: "西丽",
    ageRange: "4-6岁",
    courseCategory: "体适能",
    courseDetail: "综合体能",
    courseGoal: "兴趣培养",
    availableTime: "周六下午",
    duration: "45分钟",
    currentPeople: 2,
    targetPeople: 4,
    budget: "人均150-200元/节",
    daysLeft: 3,
    expiresAt: "6月29日",
    note: "不想太远，最好可先试一次。",
    status: "active",
  },
  {
    id: "nanyou-dance",
    area: "南油",
    ageRange: "5-6岁",
    courseCategory: "舞蹈",
    courseDetail: "中国舞",
    courseGoal: "系统学习",
    availableTime: "工作日晚",
    duration: "1小时",
    currentPeople: 4,
    targetPeople: 4,
    budget: "人均200-300元/节",
    daysLeft: 2,
    expiresAt: "6月28日",
    note: "等待平台确认参与意向。",
    status: "full_pending",
  },
  {
    id: "qianhai-lego",
    area: "前海",
    ageRange: "6-8岁",
    courseCategory: "乐高科创",
    courseDetail: "乐高/科创",
    courseGoal: "兴趣培养",
    availableTime: "周日下午",
    duration: "1.5小时",
    currentPeople: 3,
    targetPeople: 6,
    budget: "人均200-300元/节",
    daysLeft: 4,
    expiresAt: "6月30日",
    note: "想找同年龄孩子一起，偏动手和科创实验。",
    status: "active",
  },
];

export const areas = [
  "科技园",
  "后海",
  "蛇口",
  "西丽",
  "南油",
  "前海",
  "南头",
  "白石洲",
  "华侨城",
  "深圳湾",
  "其他",
];

export const ageRanges = [
  "3-4岁",
  "4-5岁",
  "5-6岁",
  "6-7岁",
  "7-8岁",
  "8-9岁",
  "9-10岁",
  "10岁以上",
];

export const courseCategories = [
  "美术",
  "舞蹈",
  "游泳",
  "篮球",
  "体适能",
  "乐高科创",
  "音乐",
  "其他",
];

export const courseDetailOptions: Record<string, string[]> = {
  美术: ["儿童画", "素描", "国画", "创意美术", "水彩", "其他"],
  舞蹈: ["中国舞", "芭蕾", "拉丁舞", "街舞", "启蒙舞蹈", "其他"],
  游泳: ["启蒙", "提升", "私教拼课", "其他"],
  篮球: ["启蒙", "基础", "提升", "其他"],
  体适能: ["启蒙", "基础体能", "协调训练", "综合体能", "其他"],
  乐高科创: ["乐高", "编程", "科创实验", "其他"],
  音乐: ["钢琴", "声乐", "架子鼓", "小提琴", "其他"],
  其他: ["其他"],
};

export const courseGoals = ["体验试课", "兴趣培养", "系统学习"];

export const timeOptions = [
  "周六上午",
  "周六下午",
  "周日上午",
  "周日下午",
  "周末都可",
  "工作日晚",
  "都可以",
];

export const durationOptions = ["45分钟", "1小时", "1.5小时", "2小时", "都可以"];

export const currentPeopleOptions = ["1人", "2人", "3人", "4人", "5人"];
export const targetPeopleOptions = ["2人", "3人", "4人", "5人", "6人"];

export const budgetOptions = [
  "人均100元以内/节",
  "人均100-150元/节",
  "人均150-200元/节",
  "人均200-300元/节",
  "人均300元以上/节",
  "待定",
];
