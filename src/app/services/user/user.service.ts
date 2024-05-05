import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from "../../../interfaces/User.interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";

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

  constructor(
    private http: HttpClient
  ) {}

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
      console.error('Error:', error);
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
      console.error('Error:', error);
    }
  }

  public updateEmailRequest(newEmail: string): void {

  }
}
