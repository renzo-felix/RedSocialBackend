import { Test, TestingModule } from '@nestjs/testing';
import { PracticeService } from './practice.service';
import { PrismaClient } from "@prisma/client";
const mockPrismaClient = {
  practice: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  studentOnPractice: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  notification: {
    findUnique: jest.fn(),
  },
};

describe('TweetsService', () => {
  let service: PracticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeService,
        { provide: PrismaClient, useValue: mockPrismaClient },
      ],
    }).compile();

    service = module.get<PracticeService>(PracticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all practices', async () => {
    
    const mockPractices = [
      { id: 1, Finalized: false, InitDate: new Date(), CompanyId: 123 },
      { id: 2, Finalized: true, InitDate: new Date(), CompanyId: 132 }
    ];
    mockPrismaClient.practice.findMany.mockResolvedValue(mockPractices);

    const result = await service.GetAllPractices();
    expect(mockPrismaClient.practice.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockPractices.map((p) => ({
      id: p.id,
      Finalized: p.Finalized,
      InitDate: p.InitDate,
      CompanyId: p.CompanyId,
    })));
  });

  it ('should retunr a practice by Id', async()=>{
    let fecha = new Date()
    const mockPractices = [
      { id: 1, Finalized: false, InitDate: fecha, CompanyId: 123 },
      { id: 2, Finalized: true, InitDate: new Date(), CompanyId: 132 }
    ];
    mockPrismaClient.practice.findUnique.mockResolvedValue(mockPractices) ///verifica las entradas attem renzo 
    mockPrismaClient.practice.findUnique.mockImplementation(({ where }) => {
      const practice = mockPractices.find((p) => p.id === where.id);
      return Promise.resolve(practice || null);
    });
    const result= await service.GetByIdPractice(1);
    console.log(result)
   expect(result).toEqual({
    id: 1, Finalized: false, InitDate: fecha, CompanyId: 123
   })

   })
   
   describe('PracticeService - AssignUserToPractice', () => {
    let service: PracticeService;
  
    const mockPrismaClient = {
      studentOnPractice: {
        create: jest.fn(),
      },
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PracticeService,
          { provide: PrismaClient, useValue: mockPrismaClient }, 
        ],
      }).compile();
  
      service = module.get<PracticeService>(PracticeService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    it('should assign a user to a practice successfully', async () => {
     
      const idPractice = 1;
      const idStudent = 123;
  
    
      const mockAssignment = {
        UserId: idStudent,
        PracticeId: idPractice,
      };
      mockPrismaClient.studentOnPractice.create.mockResolvedValue(mockAssignment);
  
      
      const result = await service.AssignUserToPractice(idPractice, idStudent);
  
     
      expect(mockPrismaClient.studentOnPractice.create).toHaveBeenCalledWith({
        data: {
          UserId: idStudent,
          PracticeId: idPractice,
        },
      });
  
      
      expect(result).toEqual(mockAssignment);
    });
  });
   

});
