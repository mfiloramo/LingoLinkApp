export interface Conversation {
  LatestMessage: string;
  StarterUsername: any;
  StarterUserPic: string;
  conversation_id: number; // STUB: PROPERTY NAME MUST BE UNIFIED AGAINST SQL RESPONSE
  readonly conversationId: number;
  latest_timestamp: string;
  name: string;
  randomSentence: string; // STUB: RANDOM DATA GENERATOR API
  firstName: any;
  lastName: any;
  profileImageSrc: any;
}
