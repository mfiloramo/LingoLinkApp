export interface ChatMessage {
  readonly message_id?: number;
  readonly user_id: number;
  readonly conversation_id: number;
  readonly source_language: string;
  readonly timestamp?: string;
  content: string; // NOT READONLY BECAUSE CONTENTS MAY NEED TRANSLATION
}
