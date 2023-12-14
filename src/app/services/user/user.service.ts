import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from "../../../interfaces/User.interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000';
  public userState: WritableSignal<any> = signal({
    userId: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    enabled: false,
    profileImg: ''
  })

  constructor() {}

  /** PUBLIC METHODS */
  public updateUserState(newUserState: User): void {
    this.userState.update((currentState: User) => ({ ...currentState, ...newUserState }));
  }
}
