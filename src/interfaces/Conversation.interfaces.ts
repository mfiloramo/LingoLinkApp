export interface Conversation {
  LatestMessage: string;
  StarterUsername: any;
  StarterUserPic: string;
  recipientUsername: string; // STUB?
  readonly conversationId: number;
  latestTimestamp: string;
  name: string;
  conversationName: string; // STUB?
  profileImageSrc: any;
}
