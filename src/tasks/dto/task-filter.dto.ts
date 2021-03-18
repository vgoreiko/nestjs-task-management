import { TaskStatus } from "../task-status.enum";
import {
  IsIn,
  IsNotEmpty,
  IsOptional
} from "class-validator";

export class TaskFilterDto {
  @IsOptional()
  @IsNotEmpty()
  term: string

  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus
}
