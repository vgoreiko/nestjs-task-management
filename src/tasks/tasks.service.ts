import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll() {
    return this.tasks;
  }

  createTask(data: CreateTaskDTO): Task {
    const { title, description } = data;
    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      id: uuidv4(),
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string) {
    const task = this.tasks.find((item) => item.id == id);
    if (!!task) {
      this.tasks = this.tasks.filter((item) => item.id === id);
    } else {
      return {
        message: 'NOT FOUND',
        code: 404,
      };
    }
  }

  getTaskById(id: string): Task {
    return this.tasks.find((item) => item.id === id);
  }
}
