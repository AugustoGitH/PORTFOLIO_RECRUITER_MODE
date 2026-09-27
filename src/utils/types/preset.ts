export type PresetComponent<P extends object = Record<string, unknown>> = P & {
  name: string
}
