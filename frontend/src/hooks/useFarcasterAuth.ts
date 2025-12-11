import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { isInMiniApp } from '@/utils/farcaster';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
}

export const useFarcasterAuth = () => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadFarcasterUser = async () => {
      if (!isInMiniApp()) {
        setIsLoading(false);
        return;
      }

      try {
        // Get Farcaster user context
        const context = await sdk.context.user;
        if (context) {
          setUser({
            fid: context.fid,
            username: context.username,
            displayName: context.displayName,
            pfpUrl: context.pfpUrl,
          });
        }

        // Get authentication token (Quick Auth)
        const authToken = await sdk.quickAuth.getToken();
        setToken(authToken);
      } catch (error) {
        console.error('Farcaster auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFarcasterUser();
  }, []);

  return { user, token, isLoading, isFarcaster: isInMiniApp() };
};
