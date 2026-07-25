
import { Db } from "mongodb";
import { Like } from "./types";

export const likesCollection = (db: Db)=> db.collection<Like>("likes") 