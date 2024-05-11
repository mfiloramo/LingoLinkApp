export interface ChatMessage {
  readonly messageId?: number;
  readonly userId: any;
  conversationId: any;
  readonly sourceLanguage: any;
  readonly timestamp?: string;
  textInput: string; // NOT READONLY BECAUSE CONTENTS MAY NEED TRANSLATION
}

export interface TranslationPayload {
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
  textInput: string;
}
