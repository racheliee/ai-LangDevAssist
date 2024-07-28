import { IsInt, IsString } from "class-validator";

export class SubmitTestDto {
    @IsInt()
    result: number;
}