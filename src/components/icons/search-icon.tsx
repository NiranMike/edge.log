import type { IconProps } from "./types";

export function SearchIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg" {...props}
    >
      <path d="M7.3335 13.3335C10.6472 13.3335 13.3335 10.6472 13.3335 7.3335C13.3335 4.01979 10.6472 1.3335 7.3335 1.3335C4.01979 1.3335 1.3335 4.01979 1.3335 7.3335C1.3335 10.6472 4.01979 13.3335 7.3335 13.3335Z" />
      <path d="M12.6201 13.7934C12.9734 14.86 13.7801 14.9667 14.4001 14.0334C14.9668 13.18 14.5934 12.48 13.5668 12.48C12.8068 12.4734 12.3801 13.0667 12.6201 13.7934Z" />
    </svg>
  );
}
