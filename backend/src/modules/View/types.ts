import { Schema } from "../../utils/types"

export enum ViewType  {
  Portfolio,
  Resume
}

export type View = Schema<{
  type: ViewType
  visitorId: string
}>