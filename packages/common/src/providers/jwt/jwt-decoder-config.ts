export class JwtDecoderConfig {
  constructor(
    public accessTokenSecret: string,
    public accessTokenMaxAge: number,
    public refreshTokenSecret: string,
    public refreshTokenMaxAge: number
  ) {}
}
