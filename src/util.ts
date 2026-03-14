type ClassValue = string | undefined | null | false;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getWeekday(isoDate: string) {
  return WEEKDAYS[new Date(isoDate).getDay()];
}