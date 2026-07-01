import type { SVGProps } from "react";

/** Shared props for all icon components. Colors come from `currentColor`. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}
