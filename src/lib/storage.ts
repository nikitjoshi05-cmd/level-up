export interface DailyProgress {
  date: string;
  points: number;
  completed: boolean;
}

const STORAGE_KEY = "level-up-daily-progress";

export function getDailyProgress(): DailyProgress {
  if (typeof window === "undefined") {
    return { date: getTodayString(), points: 0, completed: false };
  }

  const today = getTodayString();
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return { date: today, points: 0, completed: false };
  }

  try {
    const data: DailyProgress = JSON.parse(stored);
    // If data is from today, return it; otherwise return fresh data for today
    if (data.date === today) {
      return data;
    }
    return { date: today, points: 0, completed: false };
  } catch {
    return { date: today, points: 0, completed: false };
  }
}

export function updateDailyProgress(points: number, completed: boolean = false): void {
  if (typeof window === "undefined") return;

  const today = getTodayString();
  const progress: DailyProgress = {
    date: today,
    points,
    completed,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addPoints(points: number): void {
  const current = getDailyProgress();
  const newPoints = Math.min(current.points + points, 100);
  updateDailyProgress(newPoints, newPoints >= 100);
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

