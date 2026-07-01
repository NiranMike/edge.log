import type { IconProps } from "./types";

export function DownloadIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg" {...props}
    >
      <path d="M6.21338 7.78662L7.92005 9.49329L9.62671 7.78662" />
      <path d="M7.91992 2.6665V9.4465" />
      <path d="M13.3332 8.12012C13.3332 11.0668 11.3332 13.4535 7.99984 13.4535C4.6665 13.4535 2.6665 11.0668 2.6665 8.12012" />
    </svg>
  );
}
