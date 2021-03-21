import {
  EntityRepository,
  Repository
}               from "typeorm";
import { Task } from "./entities/task.entity";
import {
  CreateTaskDTO,
  TaskFilterDto
}               from "./dto";
import { TaskStatus } from "./task-status.enum";
import { User }       from "../auth/user.entity";
import {
  InternalServerErrorException,
  Logger
}                     from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository
  extends Repository<Task> {
  private logger = new Logger("TasksRepository");

  async createTask(
    createTaskDto: CreateTaskDTO,
    user: User
  ): Promise<Task> {
    const {
      title,
      description
    } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;

    return task;
  }

  async getTasks(
    filterDto: TaskFilterDto,
    user: User
  ): Promise<Task[]> {
    const {
      status,
      term
    } = filterDto;
    const query = this.createQueryBuilder("task");
    query.where("task.userId = :userId", { userId: user.id });

    if (status) {
      query.andWhere("task.status = :status", { status });
    }
    if (term) {
      query.andWhere("task.title LIKE :term OR task.description LIKE :term", { term: `%${term}%` });
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (e) {
      this.logger.log(`Failed to get tasks for user ${user.username}. Filters: ${JSON.stringify(filterDto)}`, e.stack);
      throw new InternalServerErrorException(e);
    }
  }
}
