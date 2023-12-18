export interface User {
  readonly userId: any,
  readonly username?: string,
  readonly email?: string,
  readonly password?: string,
  readonly firstName?: string,
  readonly lastName?: string,
  readonly enabled: boolean,
  sourceLanguage: string,
  defaultLanguage: string,
  profileImg: string,
}
