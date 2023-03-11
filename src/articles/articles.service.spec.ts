import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { validate } from 'class-validator';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';
import { ArticlesService } from './articles.service';

const articles = [
  {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    title: `Hello there`,
    description: 'desc 1',
    body: 'Body 1',
    published: false,
  },
];

describe(`ArticlesService`, () => {
  let articlesService: ArticlesService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ArticlesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    articlesService = moduleRef.get(ArticlesService);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`createArticle`, () => {
    it(`should create a new tweet`, async () => {
      // Arrange
      const mockedArticle = {
        id: 1,
        title: "title 1",
        description: "desc 1",
        body: "body 1",
        published: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      prismaService.article.create.mockResolvedValue(mockedArticle);

      // Act
      const createArticle = () =>
        articlesService.create({
          title: "title 1",
          description: "desc 1",
          body: "body 1",
          published: false,
        });

      // Assert
      await expect(createArticle()).resolves.toBe(mockedArticle);
    });

    it(`empty title should return dto error`, async () => {
      const data = {
        title: "",
        description: "desc 1",
        body: "body 1",
        published: false,
      };

      const errors = await validate(data)
      expect(errors.length).not.toBe(1)
    });
  });


  describe(`getTweets`, () => {
    it(`should return array of articles`, async () => {
      prismaService.article.findMany.mockResolvedValue(articles);

      await expect(articlesService.findAll()).resolves.toBe(articles);
    });
  });
});
