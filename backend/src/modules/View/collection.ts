
import { Db } from "mongodb";
import { View } from "./types";

export const likesCollection = (db: Db)=> db.collection<View>("likes") 