import { Heart, Zap, Shield, Users } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Avatar,
  Icon,
  Spinner,
  Skeleton,
  WalletButton,
  StatDisplay,
  ProfileCard,
  Navbar,
} from '@/components';

/**
 * ComponentShowcase
 * 
 * This file demonstrates usage of all available components from the design system.
 * Use this as a reference when creating new features.
 * 
 * To view this, create a route like `/showcase` and render this component.
 */

export const ComponentShowcase = () => {
  return (
    <div className="min-h-screen bg-secondary space-y-16 pb-16">
      {/* Navbar */}
      <Navbar logo="ChessFlip">
        <WalletButton />
      </Navbar>

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Atoms Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold border-b-3 border-primary pb-4">
            Atoms
          </h2>

          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Buttons</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="brand">Brand Button</Button>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="brand" size="sm">Small</Button>
              <Button variant="brand" size="lg">Large</Button>
            </div>
            <div className="flex gap-4">
              <Button disabled>Disabled</Button>
              <Button disabled>
                <Spinner size="sm" /> Loading
              </Button>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Cards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                </CardHeader>
                <CardContent>Standard elevated card style</CardContent>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                </CardHeader>
                <CardContent>More prominent elevation effect</CardContent>
              </Card>
              <Card variant="flat">
                <CardHeader>
                  <CardTitle>Flat Card</CardTitle>
                </CardHeader>
                <CardContent>Minimal elevation</CardContent>
              </Card>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Inputs</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
              <Input label="Email" placeholder="user@example.com" type="email" />
              <Input label="Password" type="password" placeholder="Enter password" />
              <Input label="With Error" error="Email is required" />
              <Input label="Disabled" disabled value="Disabled input" />
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="brand">Brand</Badge>
              <Badge variant="accent">Accent</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand" size="sm">Small</Badge>
              <Badge variant="brand" size="md">Medium</Badge>
            </div>
          </div>

          {/* Avatars */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Avatars</h3>
            <div className="flex flex-wrap gap-8">
              <Avatar alt="John Doe" fallbackText="JD" size="sm" />
              <Avatar alt="Jane Smith" fallbackText="JS" size="md" />
              <Avatar alt="Player" fallbackText="PL" size="lg" />
              <Avatar alt="Master" fallbackText="CM" size="xl" />
            </div>
          </div>

          {/* Icons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Icons</h3>
            <div className="flex flex-wrap gap-8">
              <Icon icon={Heart} size="sm" variant="default" />
              <Icon icon={Zap} size="md" variant="primary" />
              <Icon icon={Shield} size="lg" variant="secondary" />
              <Icon icon={Users} size="xl" variant="brand" />
            </div>
          </div>

          {/* Spinners */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Spinners</h3>
            <div className="flex flex-wrap gap-8">
              <Spinner size="sm" variant="default" />
              <Spinner size="md" variant="primary" />
              <Spinner size="lg" variant="brand" />
            </div>
          </div>

          {/* Skeletons */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Skeletons</h3>
            <Skeleton variant="text" />
            <Skeleton variant="text" count={3} />
            <div className="flex gap-4">
              <Skeleton variant="circle" width="w-12" height="h-12" />
              <Skeleton variant="rect" width="w-full" height="h-20" />
            </div>
          </div>
        </section>

        {/* Molecules Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold border-b-3 border-primary pb-4">
            Molecules
          </h2>

          {/* Wallet Button */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">WalletButton</h3>
            <div className="flex gap-4">
              <WalletButton />
            </div>
          </div>

          {/* Stat Display */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">StatDisplay</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <StatDisplay
                label="Win Rate"
                value="87%"
                badge={{ text: 'Excellent', variant: 'primary' }}
              />
              <StatDisplay
                label="Total Games"
                value="142"
                badge={{ text: 'Active Player', variant: 'secondary' }}
              />
              <StatDisplay
                label="Ranking"
                value="#45"
                badge={{ text: 'Top 100', variant: 'brand' }}
              />
            </div>
          </div>

          {/* Profile Card */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">ProfileCard</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <ProfileCard
                name="Alice Chen"
                role="Chess Master"
                avatarSrc="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
                stats={[
                  { label: 'Wins', value: 342 },
                  { label: 'Rating', value: '2400' },
                ]}
              />
              <ProfileCard
                name="Bob Turner"
                role="Intermediate Player"
                stats={[
                  { label: 'Wins', value: 87 },
                  { label: 'Rating', value: '1600' },
                ]}
              />
              <ProfileCard
                name="Charlie Dev"
                role="Casual"
                stats={[
                  { label: 'Wins', value: 12 },
                  { label: 'Rating', value: '1000' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Layout Examples */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold border-b-3 border-primary pb-4">
            Layout Examples
          </h2>

          {/* Hero Section */}
          <div className="bg-primary text-secondary p-16 border-3 border-primary space-y-6">
            <h3 className="text-4xl font-bold">Hero Section Example</h3>
            <p className="text-lg">
              This demonstrates a typical hero section layout using atoms and molecules.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary">Call to Action</Button>
              <Button variant="ghost">Learn More</Button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Feature Grid</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Fast', desc: 'Lightning-speed transactions' },
                { icon: Shield, title: 'Secure', desc: 'Blockchain-verified gameplay' },
                { icon: Users, title: 'Social', desc: 'Play with global community' },
              ].map((feature) => (
                <Card key={feature.title} variant="elevated" className="border-primary">
                  <CardHeader className="flex gap-4 flex-row items-start">
                    <Icon icon={feature.icon} size="lg" variant="primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary/70">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold border-b-3 border-primary pb-4">
            Design Principles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="default" className="space-y-4">
              <CardHeader>
                <CardTitle>Brutalist Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ 3px solid borders for visual hierarchy</p>
                <p>✓ Black and white color palette (high contrast)</p>
                <p>✓ Bold, uncompromising aesthetics</p>
                <p>✓ Direct visual communication</p>
              </CardContent>
            </Card>
            <Card variant="default" className="space-y-4">
              <CardHeader>
                <CardTitle>Atomic Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ Atoms: Smallest reusable units</p>
                <p>✓ Molecules: Simple component groups</p>
                <p>✓ Organisms: Complex sections</p>
                <p>✓ Pages: Full layouts</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

/**
 * Usage Examples
 * 
 * Import specific components as needed:
 * 
 *   import { Button, Card, Input } from '@/components';
 * 
 * Or import everything:
 * 
 *   import * as Components from '@/components';
 * 
 * Always use TypeScript types for better IDE support and error catching.
 */
