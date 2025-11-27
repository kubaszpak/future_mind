import { Injectable } from '@nestjs/common';
import { Image } from './image.entity';
import { Op } from 'sequelize';

@Injectable()
export class ImagesService {
  async createImage(data: Partial<Image>): Promise<Image> {
    return Image.create(data);
  }
  async findAllImages(
    filter: string | undefined,
    page: number,
    limit: number,
  ): Promise<{ rows: Image[]; count: number }> {
    const where = filter ? { title: { [Op.iLike]: `%${filter}%` } } : undefined;
    return Image.findAndCountAll({ where, offset: (page - 1) * limit, limit });
  }

  async findImageById(id: number): Promise<Image | null> {
    return Image.findByPk(id);
  }
}
