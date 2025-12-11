import { Navbar } from '@/components/organisms';
import { WalletConnectButton } from '@/components/molecules/WalletConnect';
import { GamePreview } from '@/components/organisms/GamePreview';
import { Badge } from '@/components/atoms';

/**
 * GamePreviewShowcase - Demo page showing all GamePreview component variations
 * Useful for testing responsive behavior and different configurations
 */
export const GamePreviewShowcase = () => {
  return (
    <>
      <Navbar>
        <WalletConnectButton />
      </Navbar>

      <main className="min-h-screen bg-secondary text-primary">
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="text-center space-y-4">
              <Badge variant="brand" size="sm" className="mx-auto w-fit">
                Component Showcase
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold">
                GamePreview Component Variations
              </h1>
              <p className="text-base md:text-lg text-primary/70 max-w-2xl mx-auto">
                Responsive preview component with Fisher-Yates shuffle and mobile-first design.
              </p>
            </header>

            {/* Grid of variations */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Variation 1: Static preview with pieces shown */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Static Preview (Landing Page)</h2>
                <GamePreview
                  showPieces={true}
                  interactive={false}
                  title="All pieces visible"
                  showStats={true}
                />
                <p className="text-sm text-primary/70">
                  Used on landing page to show game mechanics. All cards face up.
                </p>
              </div>

              {/* Variation 2: Hidden cards (realistic) */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Hidden Cards</h2>
                <GamePreview
                  showPieces={false}
                  interactive={false}
                  title="Pre-game state"
                  showStats={true}
                />
                <p className="text-sm text-primary/70">
                  Realistic game state before any cards are flipped. All show "?".
                </p>
              </div>

              {/* Variation 3: Interactive mode */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Interactive Demo</h2>
                <GamePreview
                  showPieces={false}
                  interactive={true}
                  title="Tap to flip cards"
                  showStats={true}
                />
                <p className="text-sm text-primary/70">
                  Click/tap cards to flip them. Preview mode with interaction enabled.
                </p>
              </div>

              {/* Variation 4: Minimal (no stats) */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Minimal Style</h2>
                <GamePreview
                  showPieces={true}
                  interactive={false}
                  title="Clean preview"
                  showStats={false}
                />
                <p className="text-sm text-primary/70">
                  Minimal version without stats bar. Good for tight layouts.
                </p>
              </div>

              {/* Variation 5: Custom title */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Custom Title</h2>
                <GamePreview
                  showPieces={false}
                  interactive={true}
                  title="🎮 Try your memory!"
                  showStats={true}
                />
                <p className="text-sm text-primary/70">
                  Custom title with emoji. Interactive mode for engagement.
                </p>
              </div>

              {/* Variation 6: Mobile focus */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Mobile-First Layout</h2>
                <div className="max-w-xs mx-auto">
                  <GamePreview
                    showPieces={true}
                    interactive={false}
                    title="Mobile optimized"
                    showStats={true}
                  />
                </div>
                <p className="text-sm text-primary/70">
                  Constrained width shows mobile layout. 3-column grid, smaller text.
                </p>
              </div>
            </div>

            {/* Technical details */}
            <section className="border-t-3 border-primary pt-8 space-y-6">
              <h2 className="text-2xl font-bold">Technical Details</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-brand">Fisher-Yates Shuffle</h3>
                  <p className="text-sm text-primary/70">
                    Same shuffle algorithm as GamePlayPage ensures fair randomization.
                    Each render produces a unique board layout with O(n) complexity.
                  </p>
                  <code className="block bg-accent p-3 rounded-brutalist border-2 border-primary text-xs font-mono">
                    {`for (let i = n-1; i > 0; i--) {
  const j = random(0, i+1);
  swap(arr[i], arr[j]);
}`}
                  </code>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-brand">Responsive Typography</h3>
                  <ul className="space-y-2 text-sm text-primary/70">
                    <li>• <strong>Mobile:</strong> 3-col grid, 2xl text (♔)</li>
                    <li>• <strong>Tablet:</strong> 4-col grid, 3xl text</li>
                    <li>• <strong>Desktop:</strong> 4xl text, increased spacing</li>
                    <li>• <strong>Touch targets:</strong> 48px minimum (a11y compliant)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-brand">Component Props</h3>
                  <ul className="space-y-2 text-sm text-primary/70">
                    <li>• <code>showPieces</code>: boolean - Show/hide chess pieces</li>
                    <li>• <code>interactive</code>: boolean - Enable card flipping</li>
                    <li>• <code>title</code>: string - Custom header text</li>
                    <li>• <code>showStats</code>: boolean - Toggle stats bar</li>
                    <li>• <code>className</code>: string - Additional Tailwind classes</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-brand">Brutalist Design</h3>
                  <ul className="space-y-2 text-sm text-primary/70">
                    <li>• 3px borders on all cards (border-3)</li>
                    <li>• Rounded corners with rounded-brutalist</li>
                    <li>• Shadow-brutalist-lg for depth</li>
                    <li>• High contrast: primary on accent bg</li>
                    <li>• Smooth transitions (300ms)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Usage example */}
            <section className="border-t-3 border-primary pt-8 space-y-4">
              <h2 className="text-2xl font-bold">Usage Example</h2>
              <pre className="bg-accent p-4 rounded-brutalist border-3 border-primary overflow-x-auto">
                <code className="text-sm font-mono text-primary">
{`import { GamePreview } from '@/components/organisms';

// Landing page hero
<GamePreview 
  showPieces={true}
  interactive={false}
  title="Game preview"
  showStats={true}
/>

// Interactive tutorial
<GamePreview 
  showPieces={false}
  interactive={true}
  title="Try flipping cards!"
  showStats={false}
/>

// Mobile-optimized
<div className="max-w-sm">
  <GamePreview 
    showPieces={true}
    title="📱 Mobile view"
  />
</div>`}
                </code>
              </pre>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};
