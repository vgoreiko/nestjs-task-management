import { Test }           from "@nestjs/testing";
import { TasksService }   from "./tasks.service";
import { TaskRepository } from "../task.repository";
import { TaskFilterDto }  from "../dto";
import { TaskStatus }     from "../task-status.enum";
import { User }           from "../../auth/user.entity";

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn()
});

const mockUser = {username: 'test'}

describe("TasksService", () => {
  let tasksService;
  let taskRepository;

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
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from repository', async() => {
      const filters: TaskFilterDto = {status: TaskStatus.OPEN, term: 'aaa'};
      taskRepository.getTasks.mockResolvedValue(Promise.resolve('some'));
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const result = await tasksService.getTasksWithFilters(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toBe('some')
    })
  })

  describe('getTaskById', () => {
    it('calls repository.findOne and return the task', async () => {
      taskRepository.findOne.mockResolvedValue(Promise.resolve({username: 'Ivan'}))
      expect(taskRepository.findOne).not.toHaveBeenCalled()
      const result = await tasksService.getTaskById(1, {id: 1})
      expect(result.username).toEqual('Ivan')
    })

    it('throws an error if task not found',() => {
      taskRepository.findOne.mockResolvedValue(null)
      expect(taskRepository.findOne).not.toHaveBeenCalled()
      expect(tasksService.getTaskById(1)).rejects.toThrow();
    })
  })

  describe('create Task', () => {
    it('calls repository.createTask and return the task', async () => {
      const createTaskDto = {title: 'bla', description: 'kudos'}
      const user = {id: 1, username: 'test'}
      taskRepository.createTask.mockResolvedValue(Promise.resolve(true))
      expect(taskRepository.createTask).not.toHaveBeenCalled()
      const result = await tasksService.createTask(createTaskDto, user)
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, user)
      expect(result).toEqual(true)
      expect(taskRepository.createTask).toHaveBeenCalled()
    })
  })

});
