import type { PropsWithChildren } from "react";
import type { PropsWithClassName } from "../../../utils/types";
import type { Term } from "../../../constants/intl";

export type TabEntry<V extends number = number> = {
  label: Term;
  value: V
  icon?: React.ComponentType<{ size?: number }>;
}

export type TabsProps<V extends number = number> = PropsWithClassName<PropsWithChildren<{
  tabs: TabEntry<V>[];
}>>