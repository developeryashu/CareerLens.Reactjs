import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

export interface ResumeAnalysisRecord {
  id: string
  user_id: string
  file_name: string
  raw_text: string
  ats_score: number
  overall_score: number
  analysis_data: unknown
  suggestions: unknown
  skills_extracted: unknown
  created_at: string
}

export interface PortfolioEvaluationRecord {
  id: string
  user_id: string
  url: string
  evaluation_type: string
  score: number
  evaluation_data: unknown
  suggestions: unknown
  created_at: string
}

const RESUME_ANALYSES_COLLECTION = "resume_analyses"
const PORTFOLIO_EVALUATIONS_COLLECTION = "portfolio_evaluations"

function mapResumeAnalysis(doc: {
  _id: ObjectId
  user_id: string
  file_name: string
  raw_text: string
  ats_score: number
  overall_score: number
  analysis_data: unknown
  suggestions: unknown
  skills_extracted: unknown
  created_at: string
}): ResumeAnalysisRecord {
  return {
    id: doc._id.toHexString(),
    user_id: doc.user_id,
    file_name: doc.file_name,
    raw_text: doc.raw_text,
    ats_score: doc.ats_score,
    overall_score: doc.overall_score,
    analysis_data: doc.analysis_data,
    suggestions: doc.suggestions,
    skills_extracted: doc.skills_extracted,
    created_at: doc.created_at,
  }
}

function mapPortfolioEvaluation(doc: {
  _id: ObjectId
  user_id: string
  url: string
  evaluation_type: string
  score: number
  evaluation_data: unknown
  suggestions: unknown
  created_at: string
}): PortfolioEvaluationRecord {
  return {
    id: doc._id.toHexString(),
    user_id: doc.user_id,
    url: doc.url,
    evaluation_type: doc.evaluation_type,
    score: doc.score,
    evaluation_data: doc.evaluation_data,
    suggestions: doc.suggestions,
    created_at: doc.created_at,
  }
}

export async function createResumeAnalysis(
  payload: Omit<ResumeAnalysisRecord, "id" | "created_at">,
): Promise<ResumeAnalysisRecord> {
  const db = await getDb()
  const created_at = new Date().toISOString()
  const insert = await db.collection(RESUME_ANALYSES_COLLECTION).insertOne({
    ...payload,
    created_at,
  })

  return {
    id: insert.insertedId.toHexString(),
    created_at,
    ...payload,
  }
}

export async function createPortfolioEvaluation(
  payload: Omit<PortfolioEvaluationRecord, "id" | "created_at">,
): Promise<PortfolioEvaluationRecord> {
  const db = await getDb()
  const created_at = new Date().toISOString()
  const insert = await db.collection(PORTFOLIO_EVALUATIONS_COLLECTION).insertOne({
    ...payload,
    created_at,
  })

  return {
    id: insert.insertedId.toHexString(),
    created_at,
    ...payload,
  }
}

export async function listRecentResumeAnalyses(
  userId: string,
  limit = 3,
): Promise<ResumeAnalysisRecord[]> {
  const db = await getDb()
  const results = await db
    .collection(RESUME_ANALYSES_COLLECTION)
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray()

  return results.map((item) => mapResumeAnalysis(item as Parameters<typeof mapResumeAnalysis>[0]))
}

export async function listRecentPortfolioEvaluations(
  userId: string,
  limit = 3,
): Promise<PortfolioEvaluationRecord[]> {
  const db = await getDb()
  const results = await db
    .collection(PORTFOLIO_EVALUATIONS_COLLECTION)
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray()

  return results.map((item) =>
    mapPortfolioEvaluation(item as Parameters<typeof mapPortfolioEvaluation>[0]),
  )
}

export async function listAllResumeAnalyses(userId: string): Promise<ResumeAnalysisRecord[]> {
  const db = await getDb()
  const results = await db
    .collection(RESUME_ANALYSES_COLLECTION)
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .toArray()

  return results.map((item) => mapResumeAnalysis(item as Parameters<typeof mapResumeAnalysis>[0]))
}

export async function listAllPortfolioEvaluations(
  userId: string,
): Promise<PortfolioEvaluationRecord[]> {
  const db = await getDb()
  const results = await db
    .collection(PORTFOLIO_EVALUATIONS_COLLECTION)
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .toArray()

  return results.map((item) =>
    mapPortfolioEvaluation(item as Parameters<typeof mapPortfolioEvaluation>[0]),
  )
}

export async function getResumeAnalysisById(
  userId: string,
  id: string,
): Promise<ResumeAnalysisRecord | null> {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const db = await getDb()
  const result = await db.collection(RESUME_ANALYSES_COLLECTION).findOne({
    _id: new ObjectId(id),
    user_id: userId,
  })

  if (!result) {
    return null
  }

  return mapResumeAnalysis(result as Parameters<typeof mapResumeAnalysis>[0])
}

export async function getPortfolioEvaluationById(
  userId: string,
  id: string,
): Promise<PortfolioEvaluationRecord | null> {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const db = await getDb()
  const result = await db.collection(PORTFOLIO_EVALUATIONS_COLLECTION).findOne({
    _id: new ObjectId(id),
    user_id: userId,
  })

  if (!result) {
    return null
  }

  return mapPortfolioEvaluation(result as Parameters<typeof mapPortfolioEvaluation>[0])
}
