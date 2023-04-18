import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment.local';
import { LoremIpsum } from 'lorem-ipsum';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public apiUrl: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  public async createConversation(body: object): Promise<any> {
    return this.http.post(`${this.apiUrl}/conversations`, body).toPromise();
  }

  public async loadConversationsByUserId(userId: number): Promise<any> {
    const response: any = await this.http.get(`${this.apiUrl}/conversations/${userId}`).toPromise();

    // Fetch random images for conversations
    for (const convo of response) {
      await this.fetchRandomUserData(convo);
    }

    return response;
  }

  public async loadConversationsByConvoId(conversationId: number): Promise<any> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}`).toPromise();
  }

  public async deleteConversationByConvoId(conversationId: number): Promise<any> {
    return this.http.delete(`${this.apiUrl}/conversations/${conversationId}`).toPromise();
  }

  private async fetchRandomUserData(convo: any) {
    try {
      const response: any = await this.http.get('https://randomuser.me/api/').toPromise();
      convo.profileImageSrc = response['results'][0]['picture']['large'];
      convo.firstName = response['results'][0]['name']['first'];
      convo.lastName = response['results'][0]['name']['last'];

      const lorem: any = new LoremIpsum({
        sentencesPerParagraph: {
          max: 1,
          min: 1
        },
        wordsPerSentence: {
          max: 16,
          min: 4
        },
      });

      convo.randomSentence = lorem.generateSentences(1);
    } catch (error) {
      console.error('Error fetching random user data:', error);
    }
  }
}
