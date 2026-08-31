// Stage 7, Tier 4: Compute consecutive daily expense logging streaks from SQLite history.

import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/db";

export interface StreakInfo {
  currentStreak: number;
  loggedToday: boolean;
}

export function useStreakTracker() {
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    currentStreak: 0,
    loggedToday: false,
  });

  const loadStreak = useCallback(() => {
    try {
      const rows = db.getAllSync<{ day_str: string }>(
        `SELECT DISTINCT substr(date, 1, 10) as day_str
         FROM transactions
         ORDER BY day_str DESC;`,
      );

      const uniqueDays = new Set(rows.map((r) => r.day_str));
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const loggedToday = uniqueDays.has(todayStr);
      let streak = 0;

      // Determine starting reference date for consecutive streak calculation
      let checkDate = new Date(today);
      if (!loggedToday) {
        // If not logged today, check if yesterday was logged to keep the streak alive
        if (uniqueDays.has(yesterdayStr)) {
          checkDate = yesterday;
        } else {
          setStreakInfo({ currentStreak: 0, loggedToday: false });
          return;
        }
      }

      // Count consecutive days backward
      while (true) {
        const dateKey = checkDate.toISOString().split("T")[0];
        if (uniqueDays.has(dateKey)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      setStreakInfo({ currentStreak: streak, loggedToday });
    } catch (error) {
      console.error("Failed to compute logging streak:", error);
    }
  }, []);

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  return { streakInfo, refreshStreak: loadStreak };
}
