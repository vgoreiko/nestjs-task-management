import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
}                       from "@nestjs/common";
import { TasksService } from "./services/tasks.service";
import { Task }         from "./entities/task.entity";
import {
  CreateTaskDTO,
  TaskFilterDto
}                       from "./dto";
import { TaskStatusValidationPipe } from "./pipes";
import { TaskStatus }               from "./task-status.enum";
import { DeleteResult }             from "typeorm";
import { AuthGuard }                from "@nestjs/passport";
import { GetUser }                  from "../auth/get-user.decorator";
import { User }                     from "../auth/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')
  constructor(private tasksService: TasksService) {
  }

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterDto: TaskFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`User: ${user.username} retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasksWithFilters(filterDto, user);
  }

  @Get("/:id")
  getTaskById(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.log(`User: ${user.username} creating the task with the following data: ${JSON.stringify(createTaskDTO)}`)
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Delete("/:id")
  deleteTaskById(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<DeleteResult> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body("status", TaskStatusValidationPipe) status: TaskStatus
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
