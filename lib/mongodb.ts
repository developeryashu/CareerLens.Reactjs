import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB ?? "careerlens"

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.")
}

type GlobalMongo = {
  clientPromise?: Promise<MongoClient>
}

const globalForMongo = globalThis as typeof globalThis & GlobalMongo

const clientPromise =
  globalForMongo.clientPromise ??
  new MongoClient(uri, {
    appName: "careerlens",
  }).connect()

if (process.env.NODE_ENV !== "production") {
  globalForMongo.clientPromise = clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

