import { db } from "../db";
import { job, type InsertJob, type SelectJob } from "../db/schema";
import { like, eq } from "drizzle-orm";
import { type IBaseRepository, IHasId } from "./interface"; // Assuming the interface is in a separate file

export class JobRepository implements IBaseRepository<SelectJob, InsertJob> {
  async save(data: InsertJob): Promise<void> {
    await db.insert(job).values(data);
  }

  async findMany({
    page = 1,
    limit = 10,
    search = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Array<SelectJob>> {
    const offset = (page - 1) * limit;

    return db.query.job.findMany({
      where: search ? like(job.title, `%${search}%`) : undefined,
      limit: limit,
      offset: offset,
    });
  }

  async findById(id: SelectJob["id"]): Promise<SelectJob | undefined> {
    return db.query.job.findFirst({
      where: eq(job.id, id),
    });
  }

  async update(
    id: SelectJob["id"],
    data: Partial<Omit<SelectJob, "id">>,
  ): Promise<void> {
    await db.update(job).set(data).where(eq(job.id, id));
  }

  async delete(id: SelectJob["id"]): Promise<void> {
    await db.delete(job).where(eq(job.id, id));
  }
}
