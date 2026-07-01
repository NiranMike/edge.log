import type { IconProps } from "./types";

export function HomeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 18 18" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg" {...props}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M14.8815 6.22395L10.3815 2.7237C9.56925 2.09145 8.4315 2.09145 7.6185 2.7237L3.1185 6.22395C2.57025 6.64995 2.25 7.30545 2.25 7.99995V13.4997C2.25 14.7424 3.25725 15.7497 4.5 15.7497H13.5C14.7428 15.7497 15.75 14.7424 15.75 13.4997V7.99995C15.75 7.30545 15.4298 6.64995 14.8815 6.22395Z" />
      <path d="M6.75 12.75H11.25" />
    </svg>
  );
}
