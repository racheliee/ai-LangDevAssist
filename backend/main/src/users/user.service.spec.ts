import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        ConfigService,
        Logger,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Mock user creation
    await prismaService.users.create({
      data: {
        id: 'user-id',
        loginId: 'login-id',
        nickname: 'nickname',
        password: 'password',
        birth: new Date('2000-01-01'),
        interest: 'interest',
      },
    });

    // Mock achievement creation
    await prismaService.achievements.createMany({
      data: [
        { id: 'achievement-1', title: 'Achievement 1', score: 0.1, level: 1 },
        { id: 'achievement-2', title: 'Achievement 2', score: 0.2, level: 2 },
      ],
    });

    // Mock external functions used within getAchievements
    jest.spyOn(service as any, 'checkAndCreateAnsRateAchievement').mockResolvedValue(undefined);
    jest.spyOn(service as any, 'checkAndCreateDistinctDaysAchievement').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await prismaService.userAchievements.deleteMany();
    await prismaService.achievements.deleteMany();
    await prismaService.progresses.deleteMany();
    await prismaService.users.deleteMany();
    jest.clearAllMocks();
  });

  describe('getAchievements', () => {
    it('should return all achievements and the highest level', async () => {
      const userId = 'user-id';
      const userAchievements = [
        {
          achievement: { title: 'Achievement 1', score: 0.1, level: 1 },
          createdAt: new Date('2023-01-01'),
        },
        {
          achievement: { title: 'Achievement 2', score: 0.2, level: 2 },
          createdAt: new Date('2023-02-01'),
        },
      ];

      jest.spyOn(prismaService.userAchievements, 'findMany').mockResolvedValue(userAchievements as any);

      const result = await service.getAchievements(userId);

      expect(prismaService.userAchievements.findMany).toHaveBeenCalled();
      expect(result).toEqual({
        achievements: [
          {
            achievement: { title: 'Achievement 1', score: 0.1, level: 1 },
            createdAt: new Date('2023-01-01'),
          },
          {
            achievement: { title: 'Achievement 2', score: 0.2, level: 2 },
            createdAt: new Date('2023-02-01'),
          },
        ],
        highestLevel: 2,
      });
    });

    it('should return an empty array and 0 for highest level if no achievements found', async () => {
      const userId = 'user-id';
      jest.spyOn(prismaService.userAchievements, 'findMany').mockResolvedValue([]);

      const result = await service.getAchievements(userId);

      expect(prismaService.userAchievements.findMany).toHaveBeenCalled();
      expect(result).toEqual({
        achievements: [],
        highestLevel: 0,
      });
    });
  });
});


// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { PrismaService } from '../prisma/prisma.service';
// import { ConfigService } from '@nestjs/config';
// import { Logger } from '@nestjs/common';
// import { Users, Progresses, UserAchievements } from '@prisma/client';

// describe('UsersService', () => {
//   let service: UsersService;
//   let prismaService: PrismaService;
//   let configService: ConfigService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         PrismaService,
//         ConfigService,
//         Logger,
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     prismaService = module.get<PrismaService>(PrismaService);
//     configService = module.get<ConfigService>(ConfigService);

//     // Mock user creation
//     await prismaService.users.create({
//       data: {
//         id: 'user-id',
//         loginId: 'login-id',
//         nickname: 'nickname',
//         password: 'password',
//         birth: new Date('2000-01-01'),
//         interest: 'interest',
//       },
//     });
//   });

//   afterEach(async () => {
//     await prismaService.userAchievements.deleteMany();
//     await prismaService.achievements.deleteMany();
//     await prismaService.progresses.deleteMany();
//     await prismaService.users.deleteMany();
//   });

//   describe('checkAndCreateDistinctDaysAchievement', () => {
//     it('should create a new distinct days achievement if eligible', async () => {
//       const userId = 'user-id';
//       const learningDays = [
//         { createdAt: new Date('2023-01-01') },
//         { createdAt: new Date('2023-01-02') },
//         { createdAt: new Date('2023-01-03') },
//       ];

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(learningDays as any);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(null);
//       jest.spyOn(prismaService.achievements, 'create').mockResolvedValue({ id: 'achievement-id' } as any);
//       jest.spyOn(prismaService.userAchievements, 'create').mockResolvedValue({} as any);

//       await service['checkAndCreateDistinctDaysAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { createdAt: true } });
//       expect(prismaService.achievements.create).toHaveBeenCalled();
//       expect(prismaService.userAchievements.create).toHaveBeenCalledWith({
//         data: { userId, achievementId: 'achievement-id' },
//       });
//     });

//     it('should not create a new distinct days achievement if not eligible', async () => {
//       const userId = 'user-id';
//       const learningDays = [
//         { createdAt: new Date('2023-01-01') },
//         { createdAt: new Date('2023-01-02') },
//         { createdAt: new Date('2023-01-03') },
//         { createdAt: new Date('2023-01-04') },
//       ];

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(learningDays as any);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(null);
//       jest.spyOn(prismaService.achievements, 'create').mockResolvedValue({ id: 'achievement-id' } as any);
//       jest.spyOn(prismaService.userAchievements, 'create').mockResolvedValue({} as any);

//       await service['checkAndCreateDistinctDaysAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { createdAt: true } });
//       expect(prismaService.achievements.create).not.toHaveBeenCalledWith(
//         // day 5 achievement should not be created
//         expect.objectContaining({ score: 5 }),
//       );
//       expect(prismaService.userAchievements.create).not.toHaveBeenCalledWith(
//         // day 5 achievement should not be created
//         expect.objectContaining({ achievementId: 'achievement-id' }),
//       );
//     });

//     it('should skip creating an achievement if it already exists', async () => {
//       const userId = 'user-id';
//       const learningDays = [
//         { createdAt: new Date('2023-01-01') },
//         { createdAt: new Date('2023-01-02') },
//         { createdAt: new Date('2023-01-03') },
//       ];
//       const existingAchievement: UserAchievements = {
//         id: 'existing-achievement-id',
//         userId,
//         achievementId: 'achievement-id',
//         createdAt: new Date(),
//       };

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(learningDays as any);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(existingAchievement);
//       jest.spyOn(prismaService.achievements, 'create').mockResolvedValue({ id: 'achievement-id' } as any);
//       jest.spyOn(prismaService.userAchievements, 'create').mockResolvedValue({} as any);

//       await service['checkAndCreateDistinctDaysAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { createdAt: true } });
//       expect(prismaService.achievements.create).not.toHaveBeenCalled();
//       expect(prismaService.userAchievements.create).not.toHaveBeenCalled();
//     });
//   });

//   describe('checkAndCreateAnsRateAchievement', () => {
//     it('should create a new answer rate achievement if eligible', async () => {
//       const userId = 'user-id';
//       const progressments: Progresses[] = [
//         { id: 'progress-1', userId, total: 10, correct: 7, createdAt: new Date('2023-01-01') },
//       ];

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(progressments);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(null);
//       jest.spyOn(prismaService.achievements, 'create').mockResolvedValue({ id: 'achievement-id' } as any);
//       jest.spyOn(prismaService.userAchievements, 'create').mockResolvedValue({} as any);
//       jest.spyOn(service as any, 'getLevelForAnsRateAchievement').mockResolvedValue(3);

//       await service['checkAndCreateAnsRateAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { total: true, correct: true, createdAt: true } });
//       expect(prismaService.achievements.create).toHaveBeenCalled();
//       expect(prismaService.userAchievements.create).toHaveBeenCalledWith({
//         data: { userId, achievementId: 'achievement-id' },
//       });
//     });

//     it('should update existing answer rate achievement if new rate is higher', async () => {
//       const userId = 'user-id';
//       const progressments: Progresses[] = [
//         { id: 'progress-1', userId, total: 10, correct: 9, createdAt: new Date('2023-01-01') },
//       ];
//       const highestAnsRateAchievement = {
//         id: 'achievement-id',
//         userId,
//         achievement: {
//           id: 'achievement-id',
//           title: '정답률 80% 달성',
//           score: 0.8,
//           level: 5,
//           createdAt: new Date(),
//         },
//         createdAt: new Date(),
//       };

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(progressments);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(highestAnsRateAchievement as any);
//       jest.spyOn(prismaService.achievements, 'update').mockResolvedValue({ id: 'achievement-id' } as any);
//       jest.spyOn(service as any, 'getLevelForAnsRateAchievement').mockResolvedValue(6);

//       await service['checkAndCreateAnsRateAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { total: true, correct: true, createdAt: true } });
//       expect(prismaService.achievements.update).toHaveBeenCalledWith({
//         where: { id: highestAnsRateAchievement.achievement.id },
//         data: {
//           title: '정답률 90.00% 달성',
//           score: 0.9,
//           level: 6,
//         },
//       });
//     });

//     it('should not update existing answer rate achievement if new rate is not higher', async () => {
//       const userId = 'user-id';
//       const progressments: Progresses[] = [
//         { id: 'progress-1', userId, total: 10, correct: 5, createdAt: new Date('2023-01-01') },
//       ];
//       const highestAnsRateAchievement = {
//         id: 'achievement-id',
//         userId,
//         achievement: {
//           id: 'achievement-id',
//           title: '정답률 80% 달성',
//           score: 0.6,
//           level: 5,
//           createdAt: new Date(),
//         },
//         createdAt: new Date(),
//       };

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(progressments);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(highestAnsRateAchievement as any);
//       jest.spyOn(prismaService.achievements, 'update').mockResolvedValue({ id: 'achievement-id' } as any);

//       await service['checkAndCreateAnsRateAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { total: true, correct: true, createdAt: true } });
//       expect(prismaService.achievements.update).not.toHaveBeenCalled();
//     });

//     it('should create a new answer rate achievement if none exists', async () => {
//       const userId = 'user-id';
//       const progressments: Progresses[] = [
//         { id: 'progress-1', userId, total: 10, correct: 7, createdAt: new Date('2023-01-01') },
//       ];

//       jest.spyOn(prismaService.progresses, 'findMany').mockResolvedValue(progressments);
//       jest.spyOn(prismaService.userAchievements, 'findFirst').mockResolvedValue(null);
//       jest.spyOn(prismaService.achievements, 'create').mockResolvedValue({ id: 'achievement-id' } as any);
//       jest.spyOn(prismaService.userAchievements, 'create').mockResolvedValue({} as any);
//       jest.spyOn(service as any, 'getLevelForAnsRateAchievement').mockResolvedValue(3);

//       await service['checkAndCreateAnsRateAchievement'](userId);

//       expect(prismaService.progresses.findMany).toHaveBeenCalledWith({ where: { userId }, select: { total: true, correct: true, createdAt: true } });
//       expect(prismaService.achievements.create).toHaveBeenCalled();
//       expect(prismaService.userAchievements.create).toHaveBeenCalledWith({
//         data: { userId, achievementId: 'achievement-id' },
//       });
//     });
//   });
// });
