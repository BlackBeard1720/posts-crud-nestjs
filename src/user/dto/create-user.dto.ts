import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
