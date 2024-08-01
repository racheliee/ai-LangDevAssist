import { Module } from '@nestjs/common';
import { CartoonService } from './cartoon.service';
import { CartoonController } from './cartoon.controller';

@Module({
  providers: [CartoonService],
  controllers: [CartoonController]
})
export class CartoonModule {}
