import type { JwtPayload } from 'jsonwebtoken';

export class JwtUserDto {
  maTK: number;
}

export class JwtPayloadDto extends JwtUserDto implements JwtPayload {}
