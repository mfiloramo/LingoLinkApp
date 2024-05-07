import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from "../../../interfaces/User.interfaces";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userState: WritableSignal<any> = signal({
    userId: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    enabled: false,
    sourceLanguage: '',
    defaultLanguage: '',
    profileImg: ''
  })
  private apiUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /** PUBLIC METHODS */
  public updateUserState(newUserState: any): void {
    try {
      this.userState.update((currentState: User) => ({ ...currentState, ...newUserState }));
    } catch (error: any) {
      console.error('Error updating user data:', error);
    }
  }

  public updateUsername(newUsername: string): any {
    try {
      return this.http.put<any>(`${ this.apiUrl }/users/update-username`, {
        userId: this.userState().userId,
        username: newUsername
      })
        .subscribe((response: any): void => console.log(response));
    } catch (error: any) {
      console.error('Error updating username:', error);
    }
  }

  public updateName(newFirstName: string, newLastName: string): any {
    try {
      return this.http.put<any>(`${ this.apiUrl }/users/update-name`, {
        userId: this.userState().userId,
        firstName: newFirstName,
        lastName: newLastName
      })
        .subscribe((response: any): void => console.log(response));
    } catch (error: any) {
      console.error('Error updating name:', error);
    }
  }

  public deleteUser(userId: number, password: string): void {
    try {

    } catch (error: any) {
      console.error('Error deleting user:', error);
    }
  }

  public confirmChangeEmail(newEmail: string): any {
    try {
      return this.http.post<any>(`${ this.apiUrl }/users/email-update-confirm`, {
        userId: this.userState().userId,
        email: newEmail
      })
        .subscribe((response: any) => console.log(response));
    } catch (error: any) {
      console.error('Error changing email:', error);
    }
  }
}
