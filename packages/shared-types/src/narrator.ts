export interface HighlightMessage {
  readonly type: "highlight";
  readonly testId: string;
}

export interface NavigateMessage {
  readonly type: "navigate";
  readonly path: string;
}

export interface ClearMessage {
  readonly type: "clear";
}

export interface PingMessage {
  readonly type: "ping";
}

export type NarratorCommand =
  | HighlightMessage
  | NavigateMessage
  | ClearMessage
  | PingMessage;

export interface PongMessage {
  readonly type: "pong";
}

export type NarratorResponse = PongMessage;
