import * as React from "react";
import type { ElementType } from "react";
import type { ClassValue } from "clsx";

import { cn } from "../lib/utils/cn";

interface SkeletonBaseProps {
  className?: ClassValue;
}

type SkeletonProps<T extends ElementType = "div"> =
  SkeletonBaseProps & {
    as?: T;
  } & Omit<React.ComponentPropsWithoutRef<T>, keyof SkeletonBaseProps | "as">;

export const Skeleton = <T extends ElementType = "div">({
  as,
  className,
  ...rest
}: SkeletonProps<T>) => {
  const Component = (as || "div") as ElementType;

  return (
    <Component
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...rest}
    />
  );
};
