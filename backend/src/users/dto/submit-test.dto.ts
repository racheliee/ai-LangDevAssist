import { IsInt } from 'class-validator';

export class SubmitTestDto {
  @IsInt()
  result: number;
}
