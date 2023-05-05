​​export interface UserCredentials {
    username: string | any,
    password: string | any
  }
 
  export interface LoggedInUser {
    id: number,
    token: string,
    username: string
  }