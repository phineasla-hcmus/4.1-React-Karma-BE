import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class LoginDTO {
  @IsNumberString()
  @IsNotEmpty()
  tenDangNhap: string;

  @IsString()
  @IsNotEmpty()
  matKhau: string;

  @IsString()
  @IsNotEmpty()
  recaptchaValue: string;
}
