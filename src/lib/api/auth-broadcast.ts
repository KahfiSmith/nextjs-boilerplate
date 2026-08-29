export type AuthChannelMessage =
  | { type: "AUTH_REFRESH_START" }
  | { type: "AUTH_REFRESH_SUCCESS"; accessToken: string }
  | { type: "AUTH_REFRESH_FAILED" }
  | { type: "AUTH_LOGOUT" };

const CHANNEL_NAME = "auth_channel";

class AuthBroadcaster {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(message: AuthChannelMessage) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<AuthChannelMessage>) => {
        this.listeners.forEach((listener) => listener(event.data));
      };
    }
  }

  public postMessage(message: AuthChannelMessage): void {
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {}
    }
  }

  public subscribe(listener: (message: AuthChannelMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const authBroadcaster = new AuthBroadcaster();
