import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Type(() => Date)
  @IsNotEmpty()
  birth: Date;

  @IsString()
  @IsNotEmpty()
  interest: string;
}
