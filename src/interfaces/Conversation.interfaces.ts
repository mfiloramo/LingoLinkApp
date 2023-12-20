export interface Conversation {
  LatestMessage?: string;
  StarterUsername?: any;
  StarterUserPic?: string;
  conversationName?: string;
  sourceLanguage?: string;
  recipientUsername?: string | null;
  senderUserId?: string;
  readonly conversationId?: any;
  timestamp?: any;
  latestTimestamp?: string;
  profileImageSrc?: any;
}
