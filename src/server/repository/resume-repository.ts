import { db } from "../db";
import { resume, type InsertResume, type SelectResume } from "../db/schema";
import { like, eq } from "drizzle-orm";
import { type IBaseRepository, IHasId } from "./interface"; // Assuming the interface is in a separate file

export class ResumeRepository
  implements IBaseRepository<SelectResume, InsertResume>
{
  async save(data: InsertResume): Promise<void> {
    await db.insert(resume).values(data);
  }

  async findMany({
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

  async findById(id: SelectResume["id"]): Promise<SelectResume | undefined> {
    return db.query.resume.findFirst({
      where: eq(resume.id, id),
    });
  }

  async update(
    id: SelectResume["id"],
    data: Partial<Omit<SelectResume, "id">>,
  ): Promise<void> {
    await db.update(resume).set(data).where(eq(resume.id, id));
  }

  async delete(id: SelectResume["id"]): Promise<void> {
    await db.delete(resume).where(eq(resume.id, id));
  }
}
