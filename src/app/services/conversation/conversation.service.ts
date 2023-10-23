import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { LoremIpsum } from 'lorem-ipsum';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public apiUrl: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  /** PUBLIC METHODS */
  public async createConversation(body: object): Promise<any> {
    return this.http.post(`${ this.apiUrl }/conversations`, body).toPromise();
  }

  // CALLED WHEN USER LOADS CONVERSATION MODULE
  public async loadConversationsByUserId(userId?: number): Promise<any> {
    const response: any = await this.http.get(`${ environment.apiBaseUrl }/conversations`).toPromise();

    // TEMPORARY STUB: FETCH RANDOM USER IMAGES FOR STUB CONVERSATIONS
    for (const conversation of response) {
      await this.fetchRandomUserData(conversation);
    }

    return response;
  }

  // CALLED WHEN USER CLICKS CONVERSATION IN MODULE
  public async loadConversationsByConvoId(conversationId: number): Promise<any> {
    return this.http.get(`${ environment.apiBaseUrl }/conversations/${ conversationId }`).toPromise();
  }

  public async deleteConversationByConvoId(conversationId: number): Promise<any> {
    return this.http.delete(`${ this.apiUrl }/conversations/${ conversationId }`).toPromise();
  }

  /** PRIVATE METHODS */
  // TEMPORARY: GENERATE RANDOMIZED STUB USER/CONVERSATION DATA
  private async fetchRandomUserData(conversation: any): Promise<void> {
    try {
      // GENERATE RANDOM USER DATA
      const response: any = await this.http.get('https://randomuser.me/api/').toPromise();
      conversation.profileImageSrc = response['results'][0]['picture']['large'];
      conversation.firstName = response['results'][0]['name']['first'];
      conversation.lastName = response['results'][0]['name']['last'];

      // GENERATE RANDOM SENTENCE
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
      conversation.randomSentence = lorem.generateSentences(1);
    } catch (error) {
      console.error('Error fetching random user data:', error);
    }
  }
}
