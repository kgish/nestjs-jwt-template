import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';

describe('PostsController', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PostsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PostsController = module.get<PostsController>(PostsController);
    expect(controller).toBeDefined();
  });
});
