import {
  BadRequestException,
  PipeTransform
} from "@nestjs/common";
import { TaskStatus }    from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform{
  transform(
    value: any
  ): any {
    value = value.toUpperCase()
    if(value in TaskStatus){
      return value
    }
    throw new BadRequestException(`${value} is an invalid status`)
  }
}
