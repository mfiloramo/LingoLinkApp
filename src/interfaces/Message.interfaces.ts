export interface ChatMessage {
  readonly messageId?: number;
  readonly userId: any;
  conversationId: number;
  readonly sourceLanguage: any;
  readonly timestamp?: string;
  textInput: string; // NOT READONLY BECAUSE CONTENTS MAY NEED TRANSLATION
}

export interface TranslationPayload {
  readonly user: number;
  readonly sourceLanguage: string;
  readonly targLang: string;
  textInput: string;
}
