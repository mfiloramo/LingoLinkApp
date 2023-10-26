export interface ChatMessage {
  readonly message_id?: number;
  readonly user_id: any;
  conversationId: number;
  readonly source_language: any;
  readonly timestamp?: string;
  textInput: string; // NOT READONLY BECAUSE CONTENTS MAY NEED TRANSLATION
}

export interface TranslationPayload {
  readonly user: number;
  readonly source_language: string;
  readonly targLang: string;
  textInput: string;
}
