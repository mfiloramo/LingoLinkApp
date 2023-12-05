export interface User {
  readonly user_id: any,
  readonly username?: string,
  readonly email?: string,
  readonly password?: string,
  readonly firstName?: string,
  readonly lastName?: string,
  readonly enabled: boolean,
  profile_img: string,
}
