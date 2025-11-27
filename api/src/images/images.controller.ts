import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UploadedFile,
  Body,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { createS3Client } from '../s3.config';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { resizeImageBuffer } from './image-resize.helper';
import type { Express } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  async getImageById(@Param('id') id: number) {
    const image = await this.imagesService.findImageById(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  @Get()
  async getImages(
    @Query('title') title?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { rows, count } = await this.imagesService.findAllImages(
      title,
      page,
      limit,
    );
    return {
      total: count,
      page,
      limit,
      images: rows,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('width') width: number,
    @Body('height') height: number,
  ) {
    console.log('Uploading image with title:', title);

    if (!file) {
      throw new Error('No file uploaded');
    }
    const s3 = createS3Client();
    const bucket = process.env.S3_BUCKET || 'images-bucket';
    const key = `${uuidv4()}-${file.originalname}`;

    const resizedBuffer = await resizeImageBuffer(
      file.buffer,
      Number(width),
      Number(height),
      file.mimetype,
    );
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: resizedBuffer,
        ContentType: file.mimetype,
      }),
    );

    const image = await this.imagesService.createImage({
      title,
      url: `https://${bucket}.s3.amazonaws.com/${key}`,
      width,
      height,
    });
    return image;
  }
}
