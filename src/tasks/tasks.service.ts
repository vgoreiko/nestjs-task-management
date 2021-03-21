import {
  Injectable,
  NotFoundException
}                           from "@nestjs/common";
import { TaskRepository }   from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task }             from "./task.entity";
import {
  CreateTaskDTO,
  TaskFilterDto
}                           from "./dto";
import { TaskStatus }       from "./task-status.enum";
import { DeleteResult }     from "typeorm";
import { User }             from "../auth/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {
  }
  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user)
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, userId: user.id });
    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`);
    } else {
      return task;
    }
  }

  async deleteTaskById(id: number, user: User): Promise<DeleteResult> {
    return this.taskRepository.delete({ id, userId: user.id }).then((result: DeleteResult) => {
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ${id} not found`);
      }
      return result
    });
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const result = await this.taskRepository.update({id, userId: user.id}, {status})
    if(result) {
      return this.taskRepository.findOne({id})
    } else {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }

  async getTasksWithFilters(filterDto: TaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }
}
