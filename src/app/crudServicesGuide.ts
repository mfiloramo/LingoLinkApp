/**
 * - USER SERVICE -
 * import { Injectable } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 *
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class UserService {
 *   private apiUrl = 'your_api_url'; // Replace with your API URL
 *
 *   constructor(private http: HttpClient) {}
 *
 *   getUsers() {
 *     return this.http.get(`${this.apiUrl}/users`);
 *   }
 *
 *   createUser(user: any) {
 *     return this.http.post(`${this.apiUrl}/users`, user);
 *   }
 *
 *   updateUser(userId: number, user: any) {
 *     return this.http.put(`${this.apiUrl}/users/${userId}`, user);
 *   }
 *
 *   deleteUser(userId: number) {
 *     return this.http.delete(`${this.apiUrl}/users/${userId}`);
 *   }
 * }
 *
 * - CONVERSATION SERVICE -
 * import { Injectable } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 *
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class ConversationService {
 *   private apiUrl = 'your_api_url'; // Replace with your API URL
 *
 *   constructor(private http: HttpClient) {}
 *
 *   getConversations(userId: number) {
 *     return this.http.get(`${this.apiUrl}/users/${userId}/conversations`);
 *   }
 *
 *   createConversation(conversation: any) {
 *     return this.http.post(`${this.apiUrl}/conversations`, conversation);
 *   }
 *
 *   updateConversation(conversationId: number, conversation: any) {
 *     return this.http.put(`${this.apiUrl}/conversations/${conversationId}`, conversation);
 *   }
 *
 *   deleteConversation(conversationId: number) {
 *     return this.http.delete(`${this.apiUrl}/conversations/${conversationId}`);
 *   }
 * }
 *
 * - MESSAGE SERVICE -
 * import { Injectable } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 *
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class MessageService {
 *   private apiUrl = 'your_api_url'; // Replace with your API URL
 *
 *   constructor(private http: HttpClient) {}
 *
 *   getMessages(conversationId: number) {
 *     return this.http.get(`${this.apiUrl}/conversations/${conversationId}/messages`);
 *   }
 *
 *   sendMessage(conversationId: number, message: any) {
 *     return this.http.post(`${this.apiUrl}/conversations/${conversationId}/messages`, message);
 *   }
 *
 *   X-updateMessage(messageId: number, message: any) {
 *     return this.http.put(`${this.apiUrl}/messages/${messageId}`, message);
 *   }
 *
 *   X-deleteMessage(messageId: number) {
 *     return this.http.delete(`${this.apiUrl}/messages/${messageId}`);
 *   }
 * }
 *
 * - PARTICIPANT SERVICE -
 * import { Injectable } from '@angular/core';
 * import { HttpClient } from '@angular/common/http';
 *
 * @Injectable({
 *   providedIn: 'root'
 * })
 * export class ParticipantService {
 *   private apiUrl = 'your_api_url'; // Replace with your API URL
 *
 *   constructor(private http: HttpClient) {}
 *
 *   addParticipant(conversationId: number, userId: number) {
 *     return this.http.post(`${this.apiUrl}/conversations/${conversationId}/participants`, { userId });
 *   }
 *
 *   removeParticipant(conversationId: number, userId: number) {
 *     return this.http.delete(`${this.apiUrl}/conversations/${conversationId}/participants/${userId}`);
 *   }
 * }
 *
 * - SERVICE INJECTION -
 * User Service:
 * - getUsers: Displaying a list of users to add to a conversation.
 * - createUser: Registration process.
 * - updateUser: User wants to change their email or password.
 * - deleteUser: User wants to remove their account from the application.
 *
 * Conversation Service:
 * - getConversations: Displaying the user's conversation list.
 * - createConversation: User starts a new conversation with other users.
 * - updateConversation: User wants to change the conversation's name.
 * - deleteConversation: User wants to leave or remove a conversation from their list.
 *
 * Message Service:
 * - getMessages: User opens a conversation to view the messages.
 * - sendMessage: User writes and submits a message in the conversation.
 * - updateMessage: User wants to edit a previously sent message.
 * - deleteMessage: User wants to remove a message they sent.
 *
 * Participant Service:
 * - addParticipant: User wants to invite another user to join an existing conversation.
 * - removeParticipant: User wants to leave a conversation or remove another user from the conversation.
 *
 * - AUTH IMPLEMENTATION -
 * The best practice is to create a separate module for authentication and authorization related functionality, such as handling login, registration, and token management. You can call this module AuthModule. This module should contain the UserService, as well as any other services, components, and guards related to authentication.
 *
 * Injecting the UserService into the AuthModule helps keep your code modular and organized. By separating authentication-related functionality from the AppModule, it becomes easier to maintain and understand the different aspects of your application.
 *
 * When you decide to incorporate MSAL (Microsoft Authentication Library), you can also integrate it within the AuthModule. This approach ensures that all your authentication logic stays encapsulated in a single module, making it more secure and easier to manage.
 */
