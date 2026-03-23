

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getWeekday(isoDate: string) {
  return WEEKDAYS[new Date(isoDate).getDay()];
}