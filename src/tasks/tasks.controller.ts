import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
}                                   from "@nestjs/common";
import { TasksService }             from './tasks.service';
import { Task }                     from "./taks.entity";
import {
  CreateTaskDTO,
  TaskFilterDto
}                                   from "./dto";
import { TaskStatusValidationPipe } from "./pipes";
import { TaskStatus }               from "./task-status.enum";
import { DeleteResult }             from "typeorm";

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) filterDto: TaskFilterDto): Promise<Task[]> {
    return this.tasksService.getTasksWithFilters(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.tasksService.deleteTaskById(id)
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
