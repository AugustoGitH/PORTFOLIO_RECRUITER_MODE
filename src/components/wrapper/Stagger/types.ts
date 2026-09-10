import type { PropsWithChildren } from "react";

export type StaggerProps = PropsWithChildren<{
  animate?: boolean;
  animation?: string;
  step?: number;
  initialDelay?: number;
}>
