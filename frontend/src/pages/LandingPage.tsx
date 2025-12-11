import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Navbar, GamePreview, Footer } from '@/components/organisms';
import { WalletConnectButton } from '@/components/molecules/WalletConnect';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';
import {
  ArrowRight,
  HandCoins,
  LayoutDashboard,
  Medal,
  Shield,
  Smartphone,
  Trophy,
  Users,
} from 'lucide-react';

export const LandingPage = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  const highlights = [
    { label: 'Entry Fee Per Match', value: '0.001 cUSD' },
    { label: 'Supported Wallets', value: '4+' },
    { label: 'Chain', value: 'Celo' },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-Friendly',
      description: 'Play seamlessly on your phone with MiniPay, Valora, or any Celo wallet.',
    },
    {
      icon: Shield,
      title: 'Fully Transparent',
      description: 'Every transaction lives on Celo blockchain. No secrets, no surprises.',
    },
    {
      icon: Trophy,
      title: 'Real Rewards',
      description: 'Win cUSD and claim it whenever you want. Your earnings, your control.',
    },
    {
      icon: Users,
      title: 'Your Wallet, Your Choice',
      description: 'Works with MiniPay, Valora, Coinbase Wallet, MetaMask and more.',
    },
  ];

  const steps = [
    {
      icon: LayoutDashboard,
      title: '1. Connect Your Wallet',
      description: 'Use MiniPay, Valora, MetaMask or any Celo wallet to get started.',
    },
    {
      icon: HandCoins,
      title: '2. Create Username & Play',
      description: 'Pick a username, pay 0.001 cUSD per game, and start matching chess pieces.',
    },
    {
      icon: Medal,
      title: '3. Win & Claim Rewards',
      description: 'Finish games to earn points. Claim your cUSD rewards whenever you want.',
    },
  ];

  const faqs = [
    {
      question: 'Are transactions automatic?',
      answer: 'No! You control everything. Every transaction needs your approval—no surprises, no automatic charges.',
    },
    {
      question: 'Which wallets work with ChessFlip?',
      answer: 'MiniPay, Valora, MetaMask, Coinbase Wallet, and any wallet that supports Celo.',
    },
    {
      question: 'What do I need to start playing?',
      answer: 'Just 0.001 cUSD per game plus a tiny amount of CELO for transaction fees. That\'s it!',
    },
  ];

  const truncatedAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  const handleStartClick = () => {
    navigate('/lobby');
  };

  return (
    <>
      <Navbar>
        <WalletConnectButton />
      </Navbar>

      <main className="min-h-screen bg-secondary text-primary">
        {/* Hero Section */}
        <section className="border-b-3 border-primary bg-secondary">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <Badge variant="brand" size="md" className="mx-auto lg:mx-0 w-fit font-semibold">
                Built for Celo & MiniPay
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Match Chess Pieces.<br />Win Real cUSD.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary/80 max-w-2xl mx-auto lg:mx-0 font-medium">
                Play memory matching games, earn crypto rewards. You control every transaction.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isConnected ? (
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={handleStartClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    Enter the game lobby
                    <Icon icon={ArrowRight} size="md" />
                  </Button>
                ) : (
                  <>
                    <div className="w-full sm:w-auto">
                      <WalletConnectButton />
                    </div>
                    <p className="text-sm text-primary/70">Connect wallet to start playing</p>
                  </>
                )}
              </div>
              {isConnected && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-sm text-primary/80">
                  <Badge variant="secondary" size="sm" className="w-fit">
                    {truncatedAddress}
                  </Badge>
                  <span>Entry fee per match: <span className="font-semibold">0.001 cUSD</span></span>
                </div>
              )}
            </div>
            <div className="lg:col-span-5">
              <GamePreview 
                showPieces={true}
                interactive={false}
                title="Game preview"
                showStats={true}
              />
            </div>
          </div>
        </section>

        {/* Highlight Stats */}
        <section className="border-b-3 border-primary bg-accent">
          <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-3 text-center">
            {highlights.map((item) => (
              <div key={item.label} className="space-y-3">
                <p className="text-3xl md:text-4xl font-bold text-brand">{item.value}</p>
                <p className="text-base font-semibold text-primary/90">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-b-3 border-primary bg-secondary">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 space-y-12">
            <div className="space-y-4 text-center">
              <Badge variant="secondary" size="md" className="mx-auto w-fit font-semibold">
                Why Players Choose Us
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold">Simple. Fast. Rewarding.</h2>
              <p className="text-lg md:text-xl text-primary/80 max-w-3xl mx-auto font-medium">
                No complexity. No hidden fees. Just fun games and real crypto rewards on your phone or desktop.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} variant="default" className="border-primary h-full flex flex-col">
                  <CardHeader className="space-y-4 pb-4 border-0">
                    <div className="p-4 bg-brand/10 border-3 border-primary rounded-brutalist w-fit">
                      <Icon icon={feature.icon} size="lg" variant="brand" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-primary/80 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b-3 border-primary bg-accent">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 space-y-12">
            <div className="space-y-4 text-center">
              <Badge variant="brand" size="md" className="mx-auto w-fit text-secondary font-semibold">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold">Start Playing in 3 Steps</h2>
              <p className="text-lg md:text-xl text-primary/80 max-w-2xl mx-auto font-medium">
                Connect. Play. Win. It's that simple.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title} variant="default" className="border-primary h-full">
                  <CardHeader className="space-y-4 pb-4 border-0">
                    <div className="p-4 bg-brand text-secondary border-3 border-primary rounded-brutalist w-fit">
                      <Icon icon={step.icon} size="lg" />
                    </div>
                    <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-primary/80 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-b-3 border-primary bg-brand/10">
          <div className="max-w-4xl mx-auto px-4 py-20 md:py-24 space-y-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Win?</h2>
            <p className="text-xl md:text-2xl text-primary/80 font-medium">
              {isConnected 
                ? 'Jump into the lobby and start your first match now.'
                : 'Connect your wallet and start earning cUSD today.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isConnected ? (
                <Button 
                  variant="brand" 
                  size="lg" 
                  onClick={handleStartClick} 
                  className="w-full sm:w-auto flex items-center gap-2 text-lg px-8 py-6"
                >
                  Enter Lobby
                  <Icon icon={ArrowRight} size="md" />
                </Button>
              ) : (
                <WalletConnectButton />
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b-3 border-primary bg-accent">
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-20 space-y-10">
            <div className="space-y-4 text-center">
              <Badge variant="brand" size="md" className="mx-auto w-fit text-secondary font-semibold">
                Questions?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Know</h2>
            </div>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <Card key={faq.question} variant="default" className="border-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-primary/80 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
};
