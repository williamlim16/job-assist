import { db } from "../db";
import { resume, type InsertResume, type SelectResume } from "../db/schema";
import { like, eq } from "drizzle-orm";

export async function createExercise(data: InsertResume) {
  await db.insert(resume).values(data);
}

export async function getExercises({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<Array<SelectResume>> {
  const offset = (page - 1) * limit;

  return db.query.resume.findMany({
    where: search ? like(resume.title, `%${search}%`) : undefined,
    limit: limit,
    offset: offset,
  });
}

export async function getExerciseById(
  id: SelectResume["id"],
): Promise<SelectResume | undefined> {
  return db.query.resume.findFirst({
    where: eq(resume.id, id),
  });
}

export async function updateExercise(
  id: SelectResume["id"],
  data: Partial<Omit<SelectResume, "id">>,
) {
  await db.update(resume).set(data).where(eq(resume.id, id));
}

export async function deleteEvent(id: SelectResume["id"]) {
  await db.delete(resume).where(eq(resume.id, id));
}
