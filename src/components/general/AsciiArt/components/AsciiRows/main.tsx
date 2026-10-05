import { cn } from "@/utils/tailwind";
import { AsciiRowsProps } from "./types";
import { ACCENT, PULSE } from "../../constants";
import { getAsciiRunKey } from "../../utils";

export const AsciiRows = (props: AsciiRowsProps) => props.rows?.map((row, rowIndex) => (
  <span key={rowIndex} className="block">
    {row.map((run, runIndex) => (
      <span
        key={getAsciiRunKey(runIndex, run.pulseId)}
        className={cn(run.tone === "accent" ? ACCENT : undefined, run.pulseId && PULSE)}
        style={run.color ? { color: run.color } : undefined}
      >
        {run.text}
      </span>
    ))}
  </span>
))
