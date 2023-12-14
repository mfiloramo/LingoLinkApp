export interface Conversation {
  LatestMessage: string;
  StarterUsername: any;
  StarterUserPic: string;
  readonly conversationId: number;
  latestTimestamp: string;
  name: string;
  randomSentence: string; // STUB: RANDOM DATA GENERATOR API
  firstName: any;
  lastName: any;
  profileImageSrc: any;
}
