export type PresetComponent<P extends object = Record<string, any>> = P & {
  name: string
}
