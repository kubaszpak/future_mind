import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './image.entity';

const mockImagesService = {
  findImageById: jest.fn(),
  findAllImages: jest.fn(),
  createImage: jest.fn(),
};

describe('ImagesController', () => {
  let imagesController: ImagesController;
  let imagesService: jest.Mocked<typeof mockImagesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [{ provide: ImagesService, useValue: mockImagesService }],
    }).compile();

    imagesController = module.get<ImagesController>(ImagesController);
    imagesService = module.get<ImagesService>(ImagesService) as jest.Mocked<
      typeof mockImagesService
    >;
  });

  describe('getImageById', () => {
    it('should return an image object', async () => {
      const image = {
        id: 1,
        title: 'Test',
        url: 'url',
        width: 100,
        height: 100,
      } as Image;
      imagesService.findImageById.mockResolvedValue(image);
      expect(await imagesController.getImageById(1)).toEqual(image);
    });

    it('should throw NotFoundException if image not found', async () => {
      imagesService.findImageById.mockResolvedValue(null);
      await expect(imagesController.getImageById(999)).rejects.toThrow(
        'Image not found',
      );
    });
  });

  describe('getImages', () => {
    it('should return paginated images', async () => {
      const rows = [
        {
          id: 1,
          title: 'Test',
          url: 'url',
          width: 100,
          height: 100,
        },
      ];
      imagesService.findAllImages.mockResolvedValue({ rows, count: 1 });
      const result = await imagesController.getImages(undefined, 1, 10);
      expect(result).toEqual({ total: 1, page: 1, limit: 10, images: rows });
    });
  });
});
