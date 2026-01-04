import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClassesService', () => {
  let service: ClassesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: PrismaService,
          useValue: {
            class: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      const mockClasses = [
        { id: '1', name: 'Class A', enrollments: [] },
        { id: '2', name: 'Class B', enrollments: [] },
      ];

      jest.spyOn(prisma.class, 'findMany').mockResolvedValue(mockClasses as any);

      const result = await service.findAll('user-id');
      expect(result).toEqual(mockClasses);
    });
  });
});