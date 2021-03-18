import {
  Injectable,
  NotFoundException
}                        from "@nestjs/common";
import { TaskStatus }    from "./task-status.enum";
import { Task }          from "./task.model";
import { v4 as uuidv4 }  from "uuid";
import {
  CreateTaskDTO,
  TaskFilterDto
} from "./dto";

const stub: Task[] = [
  {
    title: "Task1",
    description: "Desc",
    status: TaskStatus.IN_PROGRESS,
    id: "79b724a7-15cb-4b7f-943e-6e2368bb6b39"
  },
  {
    "title": "Task2",
    "description": "Desc2",
    "status": TaskStatus.IN_PROGRESS,
    "id": "d8126e08-cd50-4868-98ca-50252db3aeec"
  },
  {
    "title": "Task3",
    "description": "Desc3",
    "status": TaskStatus.DONE,
    "id": "2447953e-9897-477b-b155-fb736d130799"
  }
]

@Injectable()
export class TasksService {
  private tasks: Task[] = stub;

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
    const task = this.getTaskById(id)
    return this.tasks = this.tasks.filter((task) => task.id === id)
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);
    if(!task) {
      throw new NotFoundException(`Task with ${id} not found`)
    } else {
      return task
    }
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) return { ...task, status };
      return task;
    });
    return this.tasks.find((item) => item.id === id);
  }

  getTasksWithFilters(filterDto: TaskFilterDto): Task[] {
    const {status, term} = filterDto
    let tasks = this.getAll()
    if(status) {
      tasks = tasks.filter(item => item.status === status)
    }
    if(term) {
      tasks = tasks.filter(item => item.description.includes(term) || item.title.includes(term))
    }
    return tasks
  }
}
