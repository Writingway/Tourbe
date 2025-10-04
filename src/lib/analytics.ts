interface AnalyticsEvent {
  type: 'quiz_started' | 'quiz_completed' | 'style_selected';
  timestamp: number;
  data?: Record<string, unknown>;
}

const STORAGE_KEY = 'whisky_finder_analytics';
const MAX_EVENTS = 1000;

export function logEvent(
  type: AnalyticsEvent['type'],
  data?: Record<string, unknown>
): void {
  try {
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      data,
    };

    const existing = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
    events.push(event);

    if (events.length > MAX_EVENTS) {
      events.shift();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn('Failed to log analytics event:', error);
  }
}

export function getAnalytics(): AnalyticsEvent[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.warn('Failed to retrieve analytics:', error);
    return [];
  }
}

export function getInsights() {
  const events = getAnalytics();
  const quizStarts = events.filter((e) => e.type === 'quiz_started').length;
  const quizCompletes = events.filter((e) => e.type === 'quiz_completed').length;
  const completionRate = quizStarts > 0 ? (quizCompletes / quizStarts) * 100 : 0;

  const styleSelections: Record<string, number> = {};
  events
    .filter((e) => e.type === 'style_selected' && e.data?.style)
    .forEach((e) => {
      const style = e.data?.style as string;
      styleSelections[style] = (styleSelections[style] || 0) + 1;
    });

  const topStyles = Object.entries(styleSelections)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    quizStarts,
    quizCompletes,
    completionRate: completionRate.toFixed(1),
    topStyles,
  };
}
