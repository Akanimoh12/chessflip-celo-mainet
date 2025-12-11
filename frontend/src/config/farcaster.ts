import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Farcaster MiniApp Configuration
 * 
 * ChessFlip as a Farcaster MiniApp - memory matching game on Celo
 */
export const farcasterConfig = {
  appName: "ChessFlip",
  appDescription: "Match chess pieces, win real cUSD on Celo Mainnet",
  iconUrl: "https://chessflip-celo.vercel.app/icon-512.png",
  splashImageUrl: "https://chessflip-celo.vercel.app/splash.png",
};

/**
 * Check if app is running inside Farcaster MiniApp environment
 * 
 * @returns true if running in Farcaster MiniApp
 */
export const isInMiniApp = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check for Farcaster MiniApp context
  return (
    window.location.search.includes("miniapp=true") ||
    window.location.search.includes("farcaster") ||
    // Check for Farcaster user agent
    (typeof navigator !== "undefined" && 
     navigator.userAgent.toLowerCase().includes("farcaster"))
  );
};

/**
 * Initialize Farcaster SDK and notify that app is ready
 * Call this after your app has finished loading
 * 
 * IMPORTANT: Always call sdk.actions.ready() to hide splash screen
 */
export const initializeFarcasterSDK = async () => {
  try {
    console.log("🎯 Initializing Farcaster MiniApp SDK...");
    
    // CRITICAL: Always call ready() to hide splash screen
    // The SDK will handle whether we're in a MiniApp context or not
    await sdk.actions.ready();
    
    console.log("✅ Farcaster SDK ready() called successfully");
    
    if (isInMiniApp()) {
      console.log("✅ Running in Farcaster MiniApp environment");
    } else {
      console.log("ℹ️ Running outside Farcaster (normal web browser)");
    }
  } catch (error) {
    console.error("❌ Failed to initialize Farcaster SDK:", error);
    // Even if there's an error, try to call ready() to avoid infinite splash
    try {
      await sdk.actions.ready();
    } catch (readyError) {
      console.error("❌ Failed to call ready():", readyError);
    }
  }
};

/**
 * Get current Farcaster user context (if available)
 */
export const getFarcasterContext = () => {
  if (!isInMiniApp()) return null;
  
  try {
    return sdk.context;
  } catch (error) {
    console.error("Error getting Farcaster context:", error);
    return null;
  }
};

export { sdk as farcasterSdk };
