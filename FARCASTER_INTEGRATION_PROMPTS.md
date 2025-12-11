# ChessFlip - Farcaster MiniApp Integration Prompts

**Purpose**: Professional AI prompts for integrating ChessFlip with Farcaster as a MiniApp on Celo.

**Official Documentation**:
- Farcaster MiniApp Docs: https://miniapps.farcaster.xyz/docs/getting-started
- Celo + Farcaster Guide: https://docs.celo.org/build-on-celo/build-with-farcaster
- Farcaster SDK Reference: https://miniapps.farcaster.xyz/docs/sdk
- LLM-Friendly Docs: https://miniapps.farcaster.xyz/llms-full.txt

**Key Requirements**:
- Node.js 22.11.0 or higher (LTS recommended)
- Farcaster Developer Mode enabled
- Existing Celo Mainnet deployment

---

## Prompt 1: Install and Configure Farcaster MiniApp SDK

```
You are a Web3 frontend architect specializing in Farcaster MiniApp development. Integrate the Farcaster MiniApp SDK into the ChessFlip React application.

CONTEXT:
- Project: ChessFlip - blockchain memory game on Celo Mainnet
- Current stack: React 18, TypeScript, Vite, wagmi v2, RainbowKit
- Location: /frontend directory
- Target: Run as Farcaster MiniApp while maintaining web functionality

INSTALLATION STEPS:

1. **Install Farcaster Dependencies**:
```bash
cd frontend
npm install @farcaster/miniapp-sdk @farcaster/miniapp-wagmi-connector
```

2. **Verify Node.js Version**:
```bash
node --version
# Must be >= 22.11.0
```

3. **Update wagmi Configuration** (/frontend/src/config/celo.ts):
   - Import: `import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"`
   - Add Farcaster connector to wagmiConfig connectors array
   - Keep existing connectors (MiniPay, Valora, MetaMask, Coinbase)
   - Farcaster connector should auto-connect when in MiniApp environment

REQUIRED CODE CHANGES:

**File: /frontend/src/config/celo.ts**
```typescript
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

// In connectors array, add:
const walletGroups = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        miniAppConnector, // ADD THIS - Farcaster MiniApp
        miniPayWallet,
        valoraWallet,
        metaMaskWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: "ChessFlip",
    projectId,
  }
);
```

**File: /frontend/src/config/farcaster.ts** (NEW):
```typescript
import { sdk } from "@farcaster/miniapp-sdk";

export const farcasterConfig = {
  appName: "ChessFlip",
  appDescription: "Chess memory game on Celo",
  iconUrl: "https://chessflip-celo.vercel.app/icon-512.png",
  splashImageUrl: "https://chessflip-celo.vercel.app/splash.png",
};

// Check if running in Farcaster MiniApp
export const isInMiniApp = () => {
  return typeof window !== "undefined" && window.location.search.includes("miniapp=true");
};
```

4. **Initialize SDK in App** (/frontend/src/main.tsx):
```typescript
import { sdk } from "@farcaster/miniapp-sdk";

// After app loads and is ready to display
sdk.actions.ready().catch(console.error);
```

VALIDATION:
- Run `npm run dev` and verify no errors
- Check browser console for SDK initialization
- Test that existing wallet connections still work
- Verify build completes: `npm run build`

OUTPUT:
Provide updated code for celo.ts, new farcaster.ts config, and main.tsx initialization. List all new dependencies added to package.json.

IMPORTANT:
- Do NOT remove existing wallet connectors
- SDK ready() call is CRITICAL - app will show infinite loading without it
- Farcaster connector should be first in list for priority in MiniApp environment

REFERENCES:
- Wagmi connector docs: https://wagmi.sh/react/api/connectors
- Farcaster SDK setup: https://miniapps.farcaster.xyz/docs/getting-started
```

---

## Prompt 2: Create Farcaster Manifest and Environment Detection

```
You are a Farcaster MiniApp configuration expert. Create the manifest file and implement environment detection for ChessFlip.

CONTEXT:
- App will run both as standalone web app and Farcaster MiniApp
- Must detect environment and adapt UI accordingly
- Manifest required for Farcaster app directory listing

TASK 1: CREATE MANIFEST FILE

**File: /frontend/public/manifest.json** (NEW)
```json
{
  "name": "ChessFlip",
  "description": "Chess memory game on Celo. Match 6 pairs of chess pieces, earn cUSD rewards. Pay 0.001 cUSD per game.",
  "iconUrl": "https://chessflip-celo.vercel.app/icon-512.png",
  "splashImageUrl": "https://chessflip-celo.vercel.app/splash-1920x1080.png",
  "splashBackgroundColor": "#1a1a1a",
  "url": "https://chessflip-celo.vercel.app",
  "homeUrl": "https://chessflip-celo.vercel.app/lobby",
  "requiredChains": [42220],
  "version": "1.0.0"
}
```

TASK 2: CREATE ASSETS
- icon-512.png: 512x512px app icon (chess piece themed)
- splash-1920x1080.png: 1920x1080px splash screen (ChessFlip branding)
- Place in /frontend/public/ directory

TASK 3: ENVIRONMENT DETECTION UTILITY

**File: /frontend/src/utils/farcaster.ts** (NEW)
```typescript
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Detect if app is running in Farcaster MiniApp environment
 */
export const isInMiniApp = (): boolean => {
  try {
    return sdk.context.isInMiniApp ?? false;
  } catch {
    return false;
  }
};

/**
 * Get Farcaster user context if available
 */
export const getFarcasterContext = async () => {
  if (!isInMiniApp()) return null;
  
  try {
    return await sdk.context.user;
  } catch (error) {
    console.error("Error getting Farcaster context:", error);
    return null;
  }
};

/**
 * Trigger haptic feedback (MiniApp only)
 */
export const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  if (!isInMiniApp()) return;
  
  try {
    sdk.haptics.impact({ style: type });
  } catch (error) {
    console.error("Haptic feedback error:", error);
  }
};

/**
 * Share to Farcaster feed
 */
export const shareToFarcaster = async (text: string, embedUrl?: string) => {
  if (!isInMiniApp()) {
    console.warn("Share only available in MiniApp");
    return;
  }
  
  try {
    await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl || "")}`);
  } catch (error) {
    console.error("Share error:", error);
  }
};
```

TASK 4: UPDATE APP COMPONENT

**File: /frontend/src/App.tsx**
```typescript
import { useEffect, useState } from 'react';
import { isInMiniApp } from '@/utils/farcaster';

function App() {
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    setIsMiniApp(isInMiniApp());
  }, []);

  return (
    <>
      {/* Show MiniApp badge if in Farcaster */}
      {isMiniApp && (
        <div className="fixed top-0 right-0 z-50 bg-purple-600 text-white px-3 py-1 text-xs">
          Farcaster
        </div>
      )}
      
      {/* Existing routes */}
      <Routes>
        {/* ... existing routes ... */}
      </Routes>
    </>
  );
}
```

TASK 5: SERVE MANIFEST
Ensure Vite serves manifest.json from public directory (already handled by Vite automatically).

VALIDATION CHECKLIST:
□ manifest.json is valid JSON
□ All URLs in manifest are HTTPS and publicly accessible
□ Icon and splash images exist and are correct dimensions
□ isInMiniApp() function works in both environments
□ No errors when calling Farcaster SDK outside MiniApp
□ Manifest accessible at: https://your-domain.com/manifest.json

OUTPUT:
Provide complete manifest.json, farcaster.ts utility file, and App.tsx updates. Include checklist of assets needed.

REFERENCES:
- Manifest schema: https://miniapps.farcaster.xyz/docs/guides/manifest
- SDK context API: https://miniapps.farcaster.xyz/docs/sdk#context
```

---

## Prompt 3: Implement Farcaster Authentication (Quick Auth)

```
You are a Farcaster authentication specialist. Implement Sign in with Farcaster (SIWF) for ChessFlip using Quick Auth.

CONTEXT:
- ChessFlip requires username registration before playing
- Current: Wallet-based registration (on-chain username)
- Goal: Support Farcaster auth + automatic username from Farcaster profile
- Maintain backward compatibility with wallet-only users

IMPLEMENTATION STRATEGY:

1. **Farcaster users**: Auto-populate username from Farcaster profile
2. **Web users**: Continue with manual username registration
3. **Store Farcaster ID**: Optional - link Farcaster ID to player address on-chain or off-chain

TASK 1: CREATE FARCASTER AUTH HOOK

**File: /frontend/src/hooks/useFarcasterAuth.ts** (NEW)
```typescript
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

        // Get authentication token
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
```

TASK 2: UPDATE REGISTRATION MODAL

**File: /frontend/src/components/molecules/RegistrationModal.tsx**

Add Farcaster auto-fill logic:
```typescript
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';

export const RegistrationModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const { user: farcasterUser } = useFarcasterAuth();
  const [username, setUsername] = useState('');

  // Auto-fill username from Farcaster
  useEffect(() => {
    if (farcasterUser && !username) {
      setUsername(farcasterUser.username);
    }
  }, [farcasterUser]);

  return (
    <div>
      {farcasterUser && (
        <div className="mb-4 p-3 bg-purple-100 rounded">
          <p className="text-sm">
            Logged in as <strong>@{farcasterUser.username}</strong> on Farcaster
          </p>
        </div>
      )}
      
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        disabled={!!farcasterUser} // Disable if Farcaster username loaded
      />
      
      {/* ... rest of form ... */}
    </div>
  );
};
```

TASK 3: ADD FARCASTER PROFILE DISPLAY

**File: /frontend/src/pages/LobbyPage.tsx**

Show Farcaster profile if authenticated:
```typescript
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';

export const LobbyPage = () => {
  const { user: farcasterUser } = useFarcasterAuth();
  
  return (
    <div>
      {farcasterUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {farcasterUser.pfpUrl && (
                <img 
                  src={farcasterUser.pfpUrl} 
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h3 className="font-bold">{farcasterUser.displayName}</h3>
                <p className="text-sm text-gray-500">@{farcasterUser.username}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
      
      {/* ... existing lobby content ... */}
    </div>
  );
};
```

TASK 4: OPTIONAL - SERVER-SIDE VERIFICATION

If you need backend verification (optional):
```typescript
// Backend API endpoint to verify Farcaster token
async function verifyFarcasterToken(token: string) {
  const response = await fetch('https://api.farcaster.xyz/v1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return response.json();
}
```

SECURITY CONSIDERATIONS:
- Never trust client-side Farcaster data without verification
- Token should be verified on backend for sensitive operations
- Farcaster username can change - store FID as unique identifier
- Wallet address is still primary identifier on-chain

TESTING:
1. Test in regular browser (no Farcaster context)
2. Test in Farcaster MiniApp (with Farcaster context)
3. Verify username auto-fill works
4. Test registration with Farcaster username
5. Verify backward compatibility with wallet-only flow

OUTPUT:
Provide complete useFarcasterAuth hook, updated RegistrationModal, and LobbyPage integration. Include testing checklist.

REFERENCES:
- Quick Auth: https://miniapps.farcaster.xyz/docs/sdk#quick-auth
- SIWF: https://docs.farcaster.xyz/developers/siwf/
- User context: https://miniapps.farcaster.xyz/docs/sdk#user-context
```

---

## Prompt 4: Add Social Features and Game Sharing

```
You are a social features developer for Web3 apps. Add Farcaster social integration to ChessFlip for sharing game results and achievements.

CONTEXT:
- Users can share wins, high scores, and challenges to Farcaster feed
- Integration should be non-intrusive (optional sharing)
- Work seamlessly in both MiniApp and web environments

TASK 1: CREATE SHARE COMPONENT

**File: /frontend/src/components/molecules/ShareToFarcaster.tsx** (NEW)
```typescript
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Share2 } from 'lucide-react';
import { isInMiniApp } from '@/utils/farcaster';
import { sdk } from '@farcaster/miniapp-sdk';

interface ShareProps {
  type: 'win' | 'leaderboard' | 'achievement';
  data: {
    score?: number;
    rank?: number;
    message?: string;
  };
}

export const ShareToFarcaster = ({ type, data }: ShareProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const inMiniApp = isInMiniApp();

  const generateShareText = () => {
    switch (type) {
      case 'win':
        return `Just won ChessFlip with ${data.score} points! 🎮♟️\n\nPlay now on Celo`;
      case 'leaderboard':
        return `Ranked #${data.rank} on ChessFlip leaderboard! 🏆\n\nCan you beat me?`;
      case 'achievement':
        return data.message || 'Playing ChessFlip on Celo! 🎮';
      default:
        return 'Check out ChessFlip on Celo!';
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    const text = generateShareText();
    const url = 'https://chessflip-celo.vercel.app';

    try {
      if (inMiniApp) {
        // Share via Farcaster MiniApp
        await sdk.actions.openUrl(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`
        );
      } else {
        // Fallback to Web Share API or clipboard
        if (navigator.share) {
          await navigator.share({ text, url });
        } else {
          await navigator.clipboard.writeText(`${text}\n${url}`);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      variant="secondary"
      size="sm"
      className="flex items-center gap-2"
    >
      <Share2 className="w-4 h-4" />
      {inMiniApp ? 'Share to Feed' : 'Share'}
    </Button>
  );
};
```

TASK 2: INTEGRATE IN GAME RESULT

**File: /frontend/src/pages/GamePage.tsx**

Add sharing after game completion:
```typescript
import { ShareToFarcaster } from '@/components/molecules/ShareToFarcaster';

export function GamePage() {
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  // When game ends successfully
  useEffect(() => {
    if (isGameWon && matches === 6) {
      setGameResult('win');
      setFinalScore(10); // Win points
    }
  }, [isGameWon, matches]);

  return (
    <div>
      {/* ... game board ... */}
      
      {gameResult === 'win' && (
        <Card className="mt-4">
          <CardContent>
            <h3 className="text-xl font-bold mb-2">🎉 You Won!</h3>
            <p className="mb-4">Earned {finalScore} points</p>
            
            <ShareToFarcaster 
              type="win" 
              data={{ score: finalScore }} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

TASK 3: ADD LEADERBOARD SHARING

**File: /frontend/src/pages/LeaderboardPage.tsx**
```typescript
import { ShareToFarcaster } from '@/components/molecules/ShareToFarcaster';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';

export function LeaderboardPage() {
  const { user } = useFarcasterAuth();
  const [userRank, setUserRank] = useState<number | null>(null);

  // Calculate user's rank
  useEffect(() => {
    if (address && players.length > 0) {
      const rank = players.findIndex(p => p.address === address) + 1;
      setUserRank(rank || null);
    }
  }, [address, players]);

  return (
    <div>
      {/* ... leaderboard table ... */}
      
      {userRank && userRank <= 10 && (
        <div className="mt-4 flex justify-center">
          <ShareToFarcaster 
            type="leaderboard" 
            data={{ rank: userRank }} 
          />
        </div>
      )}
    </div>
  );
}
```

TASK 4: ADD HAPTIC FEEDBACK

**File: /frontend/src/pages/GamePage.tsx**

Add tactile feedback for game events:
```typescript
import { triggerHaptic } from '@/utils/farcaster';

// When card is flipped
const handleCardClick = (cardId: number) => {
  triggerHaptic('light');
  // ... existing flip logic ...
};

// When match is found
useEffect(() => {
  if (isMatch) {
    triggerHaptic('medium');
  }
}, [isMatch]);

// When game is won
useEffect(() => {
  if (isGameWon) {
    triggerHaptic('heavy');
  }
}, [isGameWon]);
```

TASK 5: OPTIONAL - CAST EMBEDS

Create Open Graph meta tags for rich embeds when shared:

**File: /frontend/index.html**
```html
<head>
  <!-- Open Graph / Farcaster -->
  <meta property="og:title" content="ChessFlip - Chess Memory Game on Celo" />
  <meta property="og:description" content="Match chess pieces, earn cUSD rewards. 0.001 cUSD per game." />
  <meta property="og:image" content="https://chessflip-celo.vercel.app/og-image.png" />
  <meta property="og:url" content="https://chessflip-celo.vercel.app" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ChessFlip" />
  <meta name="twitter:description" content="Chess memory game on Celo" />
  <meta name="twitter:image" content="https://chessflip-celo.vercel.app/og-image.png" />
</head>
```

Create og-image.png: 1200x630px featuring ChessFlip branding.

TESTING CHECKLIST:
□ Share button appears after game win
□ Share works in Farcaster MiniApp
□ Fallback share works in regular browser
□ Haptic feedback works (test on mobile in MiniApp)
□ Shared links include proper embeds
□ Share text is engaging and clear

OUTPUT:
Provide ShareToFarcaster component, GamePage integration, LeaderboardPage updates, and haptic feedback implementation. Include OG meta tags.

REFERENCES:
- Farcaster sharing: https://miniapps.farcaster.xyz/docs/sdk#actions
- Haptics API: https://miniapps.farcaster.xyz/docs/sdk#haptics
- Warpcast compose: https://warpcast.com/~/compose
```

---

## Prompt 5: Testing, Publishing, and Production Deployment

```
You are a Farcaster MiniApp deployment specialist. Prepare ChessFlip for production deployment as a Farcaster MiniApp.

CONTEXT:
- App is built and tested locally
- Ready for Farcaster app directory submission
- Must work in both MiniApp and standalone web environments

PHASE 1: PRE-DEPLOYMENT TESTING

**Environment Detection Test**:
```typescript
// Add to /frontend/src/components/NetworkDebug.tsx
import { isInMiniApp } from '@/utils/farcaster';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';

export const NetworkDebug = () => {
  const { user, isFarcaster } = useFarcasterAuth();
  
  return (
    <div className="fixed bottom-0 left-0 p-2 text-xs bg-black text-white">
      <div>Environment: {isFarcaster ? 'Farcaster MiniApp' : 'Web'}</div>
      {user && <div>FID: {user.fid}</div>}
      <div>Chain: {chainId}</div>
    </div>
  );
};
```

**Testing Checklist**:
□ **Local Testing**:
  - Run `npm run dev`
  - Test all features in regular browser
  - Verify no Farcaster errors in console
  - Test wallet connections (MetaMask, Coinbase)

□ **Farcaster Developer Mode Testing**:
  1. Enable Developer Mode: https://farcaster.xyz/~/settings/developer-tools
  2. Go to "Mini Apps" section in Warpcast
  3. Click "Add Mini App" → "Test URL"
  4. Enter: `http://localhost:5173`
  5. Test all features in MiniApp environment

□ **Core Features Test**:
  - SDK ready() called (no infinite loading)
  - Farcaster connector auto-connects
  - User context loaded (FID, username)
  - Username auto-fill from Farcaster works
  - Game play functions normally
  - Share buttons appear and work
  - Haptic feedback works (mobile only)
  - Back button works (sdk.back())

□ **Mobile Testing**:
  - Test on actual iOS/Android device
  - Use Warpcast mobile app
  - Verify responsive design
  - Test touch interactions
  - Verify haptics work

PHASE 2: PRODUCTION BUILD

**Build Configuration**:
```bash
cd frontend
npm run build
npm run preview  # Test production build locally
```

**Verify Build**:
- Check dist/ folder size (should be < 5MB for fast loading)
- Test manifest.json is accessible
- Verify all assets load correctly
- Check for console errors

PHASE 3: DEPLOYMENT TO VERCEL

**Vercel Environment Variables**:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_CELO_MAINNET_RPC_URL=https://forno.celo.org
VITE_CHESSFLIP_CONTRACT_ADDRESS=0xYourMainnetAddress
VITE_DEFAULT_NETWORK=mainnet
NODE_VERSION=22
```

**Deploy**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Or connect GitHub repo for auto-deploys
```

**Vercel Configuration** (vercel.json):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

PHASE 4: FARCASTER MANIFEST VALIDATION

**Validate Manifest**:
1. Go to: https://farcaster.xyz/~/developers/mini-apps
2. Click "Validate Manifest"
3. Enter: https://chessflip-celo.vercel.app/manifest.json
4. Fix any validation errors

**Required Manifest Fields** (verify):
- name: "ChessFlip"
- description: Clear, concise (< 200 chars)
- iconUrl: 512x512px, HTTPS, publicly accessible
- splashImageUrl: 1920x1080px, HTTPS
- url: Production URL with HTTPS
- requiredChains: [42220]

PHASE 5: FARCASTER APP DIRECTORY SUBMISSION

**Submission Process**:
1. Go to: https://farcaster.xyz/~/developers/mini-apps
2. Click "Submit Mini App"
3. Fill in details:
   - App Name: ChessFlip
   - Manifest URL: https://chessflip-celo.vercel.app/manifest.json
   - Category: Games
   - Description: Match chess pieces, earn cUSD on Celo
4. Submit for review

**Review Criteria**:
- App must be functional and bug-free
- Manifest must be valid
- Must call sdk.actions.ready()
- No broken links or images
- Must follow Farcaster community guidelines

PHASE 6: POST-LAUNCH MONITORING

**Set Up Analytics**:
```typescript
// Track MiniApp usage
useEffect(() => {
  if (isInMiniApp()) {
    // Log MiniApp sessions
    analytics.track('MiniApp Session', {
      fid: user?.fid,
      timestamp: Date.now(),
    });
  }
}, []);
```

**Monitor**:
- Vercel Analytics for errors
- RPC endpoint performance
- User feedback in Farcaster
- Transaction success rate
- Wallet connection issues

**Metrics to Track**:
- Daily active users (MiniApp vs Web)
- Game completion rate
- Average games per user
- Share button click rate
- Wallet connection success rate
- Transaction failure rate

PHASE 7: MARKETING & DISTRIBUTION

**Announce on Farcaster**:
```
Cast Template:
"🎮 ChessFlip is now live on Farcaster! 

Match chess pieces, earn cUSD rewards on @Celo

✅ 0.001 cUSD per game
✅ 10 points for wins
✅ Compete on leaderboard

Try it now in Mini Apps! ♟️

https://chessflip-celo.vercel.app"
```

**Community Channels**:
- Post in Celo Discord
- Share in Farcaster developer channels
- Submit to Celo app showcase
- List on DappRadar

ROLLBACK PLAN:
- Keep previous version deployable
- Document how to pause contract
- Have emergency contact ready
- Monitor first 24 hours closely

FINAL CHECKLIST:
□ All tests passing
□ Production build successful
□ Deployed to Vercel
□ Manifest validated
□ Submitted to Farcaster directory
□ Analytics configured
□ Documentation updated
□ Team trained
□ Announcement prepared
□ Monitoring active

OUTPUT:
Provide deployment summary with all URLs, validation results, submission status, and go-live recommendation.

REFERENCES:
- Publishing guide: https://miniapps.farcaster.xyz/docs/guides/publishing
- Developer tools: https://farcaster.xyz/~/developers
- Farcaster support: https://warpcast.com/~/channel/fc-devs
```

---

## Usage Instructions

### Execution Order
1. Execute Prompt 1 first (SDK installation)
2. Then Prompt 2 (Manifest and environment)
3. Then Prompt 3 (Authentication)
4. Then Prompt 4 (Social features)
5. Finally Prompt 5 (Testing and deployment)

### Testing Strategy
- Test in regular browser after each prompt
- Test in Farcaster Developer Mode after Prompt 2
- Do full integration test after Prompt 4
- Do final testing in Prompt 5 before submission

### Important Notes
- **Node.js 22.11.0+ required** - Earlier versions will fail
- **Developer Mode required** for testing in Farcaster
- **Maintain web compatibility** - App must work standalone
- **Call sdk.actions.ready()** - Critical for MiniApp display
- **Test on mobile** - MiniApps are mobile-first

## Support Resources

- **Farcaster Developers**: https://warpcast.com/~/channel/fc-devs
- **Mini Apps Docs**: https://miniapps.farcaster.xyz
- **Celo + Farcaster**: https://docs.celo.org/build-on-celo/build-with-farcaster
- **LLM Docs**: https://miniapps.farcaster.xyz/llms-full.txt
- **Examples**: https://github.com/farcasterxyz/miniapps/tree/main/examples
- **Rewards Program**: https://farcaster.xyz/~/developers/rewards

## Common Issues

### "Infinite loading screen"
- **Cause**: sdk.actions.ready() not called
- **Fix**: Add await sdk.actions.ready() after app loads

### "Node.js version error"
- **Cause**: Using Node.js < 22.11.0
- **Fix**: Update to Node.js 22.11.0 or higher LTS

### "Connector not working in MiniApp"
- **Cause**: Farcaster connector not first in list
- **Fix**: Place farcasterMiniApp connector first in wagmi config

### "Manifest validation failed"
- **Cause**: Missing required fields or invalid URLs
- **Fix**: Use manifest validator at farcaster.xyz/~/developers

### "Share button not working"
- **Cause**: Not checking isInMiniApp() environment
- **Fix**: Add environment detection before SDK calls
