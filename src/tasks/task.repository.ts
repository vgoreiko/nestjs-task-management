import {
  EntityRepository,
  Repository
}                     from "typeorm";
import { Task }       from "./taks.entity";
import {
  CreateTaskDTO,
  TaskFilterDto
}                     from "./dto";
import { TaskStatus } from "./task-status.enum";

@EntityRepository(Task)
export class TaskRepository
  extends Repository<Task> {

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    const {
      title,
      description
    } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }

  async getTasks(filterDto: TaskFilterDto): Promise<Task[]> {
    const {
      status,
      term
    } = filterDto;
    const query = this.createQueryBuilder("task");
    if (status) {
      query.andWhere("task.status = :status", { status });
    }
    if (term) {
      query.andWhere("task.title LIKE :term OR task.description LIKE :term", { term: `%${term}%` });
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
