// Type declarations for @farcaster/miniapp-sdk
declare module "@farcaster/miniapp-sdk" {
  export interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl?: string;
  }

  export interface FarcasterContext {
    isInMiniApp?: boolean;
    user?: FarcasterUser;
  }

  export interface FarcasterSDK {
    context: FarcasterContext;
    actions: {
      ready: () => Promise<void>;
      openUrl: (url: string) => Promise<void>;
      close: () => Promise<void>;
    };
    quickAuth: {
      getToken: () => Promise<string>;
    };
    haptics?: {
      impact: (options: { style: "light" | "medium" | "heavy" }) => void;
    };
  }

  export const sdk: FarcasterSDK;
}

declare module "@farcaster/miniapp-wagmi-connector" {
  import type { CreateConnectorFn } from "wagmi";

  export function farcasterMiniApp(): CreateConnectorFn;
}
