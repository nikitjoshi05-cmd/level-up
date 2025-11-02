export type TaskStatus = 'full' | 'half' | 'missed' | null;

export interface Task {
  id: string;
  name: string;
  points: number;
  status: TaskStatus;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  points: number;
  tasks: Task[];
}

export interface DailyProgress {
  date: string;
  points: number;
  categories: Record<string, Record<string, TaskStatus>>;
  hardcoreMode: boolean;
  negativePoints: number;
  completed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakHistory: Array<{ date: string; points: number }>;
}

export interface LevelData {
  totalXP: number;
  currentLevel: string;
  levelProgress: number;
  nextLevelXP: number;
}

export interface RewardData {
  weekAverage: number;
  rewardsUnlocked: string[];
  rewardHistory: Array<{ date: string; reward: string }>;
  weeklyData: Array<{ date: string; points: number }>;
}

const STORAGE_KEYS = {
  DAILY_PROGRESS: 'level-up-daily-progress',
  STREAK_DATA: 'level-up-streak-data',
  LEVEL_DATA: 'level-up-level-data',
  REWARD_DATA: 'level-up-reward-data',
  HARDCORE_MODE: 'level-up-hardcore-mode',
};

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// Default categories and tasks
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'mindset',
    name: 'Mindset & Focus',
    icon: 'mindset', // Use string identifier instead of emoji
    points: 20,
    tasks: [
      { id: 'meditation', name: 'Meditation (10 min)', points: 10, status: null },
      { id: 'journaling', name: 'Journaling', points: 10, status: null },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Health',
    icon: 'fitness',
    points: 20,
    tasks: [
      { id: 'workout', name: 'Workout (30 min)', points: 15, status: null },
      { id: 'hydration', name: 'Drink 2L water', points: 5, status: null },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity & Learning',
    icon: 'productivity',
    points: 25,
    tasks: [
      { id: 'study', name: 'Study/Skill practice', points: 15, status: null },
      { id: 'reading', name: 'Reading (30 min)', points: 10, status: null },
    ],
  },
  {
    id: 'communication',
    name: 'Communication & Social',
    icon: 'communication',
    points: 15,
    tasks: [
      { id: 'social', name: 'Quality social time', points: 10, status: null },
      { id: 'gratitude', name: 'Express gratitude', points: 5, status: null },
    ],
  },
  {
    id: 'discipline',
    name: 'Discipline & Habits',
    icon: 'discipline',
    points: 20,
    tasks: [
      { id: 'sleep', name: 'Sleep early (before 11 PM)', points: 10, status: null },
      { id: 'routine', name: 'Follow morning routine', points: 10, status: null },
    ],
  },
];

export const HARDCORE_NEGATIVE_HABITS = [
  { id: 'mindless-scroll', name: 'Scroll >1 hr mindlessly', points: -5 },
  { id: 'skip-workout', name: 'Skip workout', points: -10 },
  { id: 'sleep-late', name: 'Sleep late (>1:30 AM)', points: -10 },
  { id: 'negative-talk', name: 'Negative self-talk', points: -5 },
];

// Scoring Functions
export function calculateCategoryPoints(category: Category, taskStatuses: Record<string, TaskStatus>): number {
  return category.tasks.reduce((total, task) => {
    const status = taskStatuses[task.id] || task.status;
    if (status === 'full') return total + task.points;
    if (status === 'half') return total + task.points * 0.5;
    return total;
  }, 0);
}

export function calculateDailyTotal(
  categories: Category[],
  taskStatuses: Record<string, Record<string, TaskStatus>>,
  hardcoreMode: boolean,
  negativeHabits: Record<string, boolean>
): number {
  let total = 0;

  // Calculate positive points from categories
  categories.forEach((category) => {
    const categoryTasks = taskStatuses[category.id] || {};
    total += calculateCategoryPoints(category, categoryTasks);
  });

  // Subtract negative points if hardcore mode is enabled
  if (hardcoreMode) {
    HARDCORE_NEGATIVE_HABITS.forEach((habit) => {
      if (negativeHabits[habit.id]) {
        total += habit.points; // points are already negative
      }
    });
  }

  return Math.max(0, Math.round(total * 10) / 10); // Round to 1 decimal, but don't go below 0
}

// Storage Functions
export function getDailyProgress(): DailyProgress {
  if (typeof window === 'undefined') {
    return {
      date: getTodayString(),
      points: 0,
      categories: {},
      hardcoreMode: false,
      negativePoints: 0,
      completed: false,
    };
  }

  const today = getTodayString();
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);

  if (!stored) {
    return {
      date: today,
      points: 0,
      categories: {},
      hardcoreMode: false,
      negativePoints: 0,
      completed: false,
    };
  }

  try {
    const data: DailyProgress = JSON.parse(stored);
    if (data.date === today) {
      return data;
    }
    return {
      date: today,
      points: 0,
      categories: {},
      hardcoreMode: data.hardcoreMode || false,
      negativePoints: 0,
      completed: false,
    };
  } catch {
    return {
      date: today,
      points: 0,
      categories: {},
      hardcoreMode: false,
      negativePoints: 0,
      completed: false,
    };
  }
}

export function saveDailyProgress(progress: DailyProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
}

export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, streakHistory: [] };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
  if (!stored) {
    return { currentStreak: 0, longestStreak: 0, streakHistory: [] };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { currentStreak: 0, longestStreak: 0, streakHistory: [] };
  }
}

export function updateStreak(points: number): StreakData {
  const today = getTodayString();
  const streakData = getStreakData();
  const history = streakData.streakHistory || [];

  // Check if we already have today's entry
  const todayIndex = history.findIndex((entry) => entry.date === today);
  if (todayIndex >= 0) {
    history[todayIndex].points = points;
  } else {
    history.push({ date: today, points });
  }

  // Sort by date
  history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = streakData.longestStreak || 0;

  // Go backwards from today
  const todayDate = new Date(today);
  for (let i = history.length - 1; i >= 0; i--) {
    const entryDate = new Date(history[i].date);
    const daysDiff = Math.floor((todayDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === currentStreak && history[i].points >= 80) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Check for longer streaks in history
  let tempStreak = 0;
  for (const entry of history) {
    if (entry.points >= 80) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const newStreakData: StreakData = {
    currentStreak,
    longestStreak,
    streakHistory: history.slice(-90), // Keep last 90 days
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(newStreakData));
  }

  return newStreakData;
}

export function getStreakTitle(streak: number): { title: string; bonus: number } {
  if (streak >= 30) return { title: 'Habitual Legend', bonus: 0 };
  if (streak >= 15) return { title: 'Momentum Master', bonus: 0 };
  if (streak >= 7) return { title: 'Disciplined Rookie', bonus: 0 };
  if (streak >= 3) return { title: 'Starter', bonus: 5 };
  return { title: 'Building Momentum', bonus: 0 };
}

export function getLevelData(): LevelData {
  if (typeof window === 'undefined') {
    return {
      totalXP: 0,
      currentLevel: 'Novice',
      levelProgress: 0,
      nextLevelXP: 500,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.LEVEL_DATA);
  if (!stored) {
    return {
      totalXP: 0,
      currentLevel: 'Novice',
      levelProgress: 0,
      nextLevelXP: 500,
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      totalXP: 0,
      currentLevel: 'Novice',
      levelProgress: 0,
      nextLevelXP: 500,
    };
  }
}

export function updateLevelData(points: number): LevelData {
  const currentData = getLevelData();
  const newTotalXP = currentData.totalXP + points;

  let currentLevel = 'Novice';
  let nextLevelXP = 500;
  let levelProgress = 0;

  if (newTotalXP >= 2000) {
    currentLevel = 'Life Hacker';
    nextLevelXP = Infinity;
    levelProgress = 100;
  } else if (newTotalXP >= 1000) {
    currentLevel = 'Master in Motion';
    nextLevelXP = 2000;
    levelProgress = ((newTotalXP - 1000) / (2000 - 1000)) * 100;
  } else if (newTotalXP >= 500) {
    currentLevel = 'Apprentice';
    nextLevelXP = 1000;
    levelProgress = ((newTotalXP - 500) / (1000 - 500)) * 100;
  } else {
    currentLevel = 'Novice';
    nextLevelXP = 500;
    levelProgress = (newTotalXP / 500) * 100;
  }

  const newLevelData: LevelData = {
    totalXP: newTotalXP,
    currentLevel,
    levelProgress: Math.min(100, Math.max(0, levelProgress)),
    nextLevelXP,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LEVEL_DATA, JSON.stringify(newLevelData));
  }

  return newLevelData;
}

export function getRewardData(): RewardData {
  if (typeof window === 'undefined') {
    return {
      weekAverage: 0,
      rewardsUnlocked: [],
      rewardHistory: [],
      weeklyData: [],
    };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.REWARD_DATA);
  if (!stored) {
    return {
      weekAverage: 0,
      rewardsUnlocked: [],
      rewardHistory: [],
      weeklyData: [],
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      weekAverage: 0,
      rewardsUnlocked: [],
      rewardHistory: [],
      weeklyData: [],
    };
  }
}

export function updateRewardData(dailyPoints: number): RewardData {
  const today = getTodayString();
  const weekStart = getWeekStart();
  const rewardData = getRewardData();

  // Update weekly data
  let weeklyData = rewardData.weeklyData || [];
  const todayIndex = weeklyData.findIndex((entry) => entry.date === today);
  
  if (todayIndex >= 0) {
    weeklyData[todayIndex].points = dailyPoints;
  } else {
    // Check if we need to reset (new week)
    if (weeklyData.length > 0) {
      const lastEntryDate = new Date(weeklyData[weeklyData.length - 1].date);
      const lastWeekStart = getWeekStart(lastEntryDate);
      if (weekStart !== lastWeekStart) {
        weeklyData = []; // Reset for new week
      }
    }
    weeklyData.push({ date: today, points: dailyPoints });
  }

  // Calculate 7-day average (or available days)
  const recentData = weeklyData.slice(-7);
  const average = recentData.length > 0
    ? recentData.reduce((sum, entry) => sum + entry.points, 0) / recentData.length
    : 0;

  // Check if rewards should be unlocked
  let rewardsUnlocked = rewardData.rewardsUnlocked || [];
  if (average >= 85 && rewardsUnlocked.length === 0) {
    rewardsUnlocked = ['available']; // Mark as available to unlock
  }

  const newRewardData: RewardData = {
    weekAverage: Math.round(average * 10) / 10,
    rewardsUnlocked,
    rewardHistory: rewardData.rewardHistory || [],
    weeklyData,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REWARD_DATA, JSON.stringify(newRewardData));
  }

  return newRewardData;
}

export function claimReward(reward: string): void {
  const rewardData = getRewardData();
  const today = getTodayString();

  rewardData.rewardHistory.push({ date: today, reward });
  rewardData.rewardsUnlocked = []; // Clear unlocked status

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REWARD_DATA, JSON.stringify(rewardData));
  }
}

export function getHardcoreMode(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEYS.HARDCORE_MODE);
  return stored === 'true';
}

export function setHardcoreMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.HARDCORE_MODE, enabled.toString());
}

