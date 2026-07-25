import { Schema } from "../../utils/types"

export enum ViewType  {
  Portfolio,
  Curriculum
}

export type View = Schema<{
  type: ViewType
  visitorId: string
}>