import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Detect if app is running in Farcaster MiniApp environment
 * 
 * @returns true if running inside Farcaster MiniApp
 */
export const isInMiniApp = (): boolean => {
  if (typeof window === "undefined") return false;
  
  try {
    // Check SDK context first
    return sdk.context.isInMiniApp ?? false;
  } catch {
    // Fallback: Check URL parameters and user agent
    return (
      window.location.search.includes("miniapp=true") ||
      window.location.search.includes("farcaster") ||
      (typeof navigator !== "undefined" && 
       navigator.userAgent.toLowerCase().includes("farcaster"))
    );
  }
};

/**
 * Get Farcaster user context if available
 * 
 * @returns Farcaster user object or null
 */
export const getFarcasterContext = async () => {
  if (!isInMiniApp()) return null;
  
  try {
    const user = await sdk.context.user;
    return user;
  } catch (error) {
    console.error("Error getting Farcaster context:", error);
    return null;
  }
};

/**
 * Trigger haptic feedback (MiniApp only)
 * 
 * @param type - Haptic feedback intensity: "light", "medium", or "heavy"
 */
export const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  if (!isInMiniApp()) return;
  
  try {
    if (sdk.haptics) {
      sdk.haptics.impact({ style: type });
    }
  } catch (error) {
    console.error("Haptic feedback error:", error);
  }
};

/**
 * Share content to Farcaster feed
 * 
 * @param text - Text content to share
 * @param embedUrl - Optional URL to embed in the cast
 */
export const shareToFarcaster = async (text: string, embedUrl?: string) => {
  if (!isInMiniApp()) {
    console.warn("Share only available in MiniApp");
    return;
  }
  
  try {
    const composeUrl = new URL("https://warpcast.com/~/compose");
    composeUrl.searchParams.append("text", text);
    if (embedUrl) {
      composeUrl.searchParams.append("embeds[]", embedUrl);
    }
    
    await sdk.actions.openUrl(composeUrl.toString());
  } catch (error) {
    console.error("Share error:", error);
  }
};

/**
 * Open a URL in the MiniApp browser or external browser
 * 
 * @param url - URL to open
 */
export const openUrl = async (url: string) => {
  if (!isInMiniApp()) {
    window.open(url, "_blank");
    return;
  }
  
  try {
    await sdk.actions.openUrl(url);
  } catch (error) {
    console.error("Error opening URL:", error);
    window.open(url, "_blank");
  }
};

/**
 * Close the MiniApp (returns to Farcaster feed)
 */
export const closeMiniApp = async () => {
  if (!isInMiniApp()) {
    console.warn("Close only available in MiniApp");
    return;
  }
  
  try {
    await sdk.actions.close();
  } catch (error) {
    console.error("Error closing MiniApp:", error);
  }
};
