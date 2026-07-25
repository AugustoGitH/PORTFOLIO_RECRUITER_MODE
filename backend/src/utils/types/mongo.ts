import { ObjectId } from "mongodb"

export type Schema<S = {}> = S & {
    _id: ObjectId
    updatedAt: Date
    createdAt: Date
}