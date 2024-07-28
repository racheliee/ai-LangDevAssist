import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  @Post()
  @UseInterceptors(FileInterceptor('voice'))
  async sendMessage(@UploadedFile() voice: Express.Multer.File) {
    console.log(voice);
    return voice;
  }
}
