import { Test }           from "@nestjs/testing";
import { TasksService }   from "./tasks.service";
import { TaskRepository } from "../task.repository";
import { TaskFilterDto }  from "../dto";
import { TaskStatus }     from "../task-status.enum";

const mockTaskRepository = () => ({
  getTasks: jest.fn()
});

const mockUser = {username: 'test'}

describe("TasksService", () => {
  let tasksService;
  let repository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository
        }
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    repository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from repository', async() => {
      const filters: TaskFilterDto = {status: TaskStatus.OPEN, term: 'aaa'};
      repository.getTasks.mockResolvedValue(Promise.resolve('some'));
      expect(repository.getTasks).not.toHaveBeenCalled();
      const result = await tasksService.getTasksWithFilters(filters, mockUser);
      expect(repository.getTasks).toHaveBeenCalled();
      expect(result).toBe('some')
    })
  })

});
