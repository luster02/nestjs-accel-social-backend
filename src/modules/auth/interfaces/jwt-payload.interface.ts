export interface IJwtPayload {
  id: string;
  username: string;
  email: string;
  iat?: Date;
}
