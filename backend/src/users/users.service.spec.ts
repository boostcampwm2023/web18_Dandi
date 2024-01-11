import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ImagesService } from 'src/images/images.service';

jest.mock('./users.repository');
jest.mock('src/images/images.service');

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let imagesService: ImagesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, ImagesService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    imagesService = module.get<ImagesService>(ImagesService);
  });
});
