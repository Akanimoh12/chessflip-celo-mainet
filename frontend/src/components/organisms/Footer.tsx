import { Link } from 'react-router-dom';
import { Badge } from '@/components/atoms';
import { Github, Twitter, FileText } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Footer - Responsive navigation footer component
 * 
 * Features:
 * - Mirrors project_structure.md sections
 * - Internal routes + external links
 * - Mobile-first responsive grid
 * - Brutalist design system
 * - Social media links
 * - Network badge (Alfajores/Mainnet)
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { label: 'Game Lobby', href: '/lobby' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'How to Play', href: '/how-to-play' },
        { label: 'Rewards', href: '/rewards' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Smart Contract', href: 'https://github.com/your-org/chessflip-celo', external: true },
        { label: 'MiniPay Guide', href: '/minipay-guide' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Developer',
      links: [
        { label: 'GitHub', href: 'https://github.com/your-org/chessflip-celo', external: true },
        { label: 'API Docs', href: '/api-docs' },
        { label: 'Contract ABI', href: '/contract-abi' },
        { label: 'Build Prompts', href: '/build-prompts' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Twitter', href: 'https://twitter.com/chessflip', external: true },
        { label: 'Discord', href: 'https://discord.gg/chessflip', external: true },
        { label: 'Support', href: '/support' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/your-org/chessflip-celo',
      label: 'GitHub',
    },
    {
      icon: Twitter,
      href: 'https://twitter.com/chessflip',
      label: 'Twitter',
    },
    {
      icon: FileText,
      href: '/docs',
      label: 'Documentation',
    },
  ];

  return (
    <footer className="bg-secondary border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Section - Logo & Description */}
        <div className="grid gap-8 lg:grid-cols-12 pb-8 border-b-3 border-primary/20">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold">♔</div>
              <h3 className="text-2xl font-bold">ChessFlip</h3>
            </div>
            <p className="text-sm text-primary/70 max-w-sm">
              Chess memory game on Celo. Pay 0.001 cUSD entry fee, match pairs, earn rewards—all on-chain with manual control.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="brand" size="sm">
                Alfajores Testnet
              </Badge>
              <Badge variant="secondary" size="sm">
                v1.0.0
              </Badge>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wide text-primary">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary/70 hover:text-brand transition-colors inline-flex items-center gap-1"
                        >
                          {link.label}
                          <span className="text-xs">↗</span>
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-sm text-primary/70 hover:text-brand transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Copyright & Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-primary/60">
            <p>© {currentYear} ChessFlip</p>
            <span className="hidden sm:inline">•</span>
            <p>Built on Celo with cUSD</p>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://celoscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
            >
              View on CeloScan
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="p-2 rounded-brutalist border-2 border-primary hover:bg-accent hover:border-brand transition-colors"
                aria-label={social.label}
              >
                <Icon icon={social.icon} size="sm" variant="primary" />
              </a>
            ))}
          </div>
        </div>

        {/* Additional Info Bar */}
        <div className="mt-8 pt-6 border-t-2 border-primary/10 text-center">
          <p className="text-xs text-primary/50">
            ChessFlip is a decentralized application. Always verify contract addresses and use testnet funds for testing.
          </p>
        </div>
      </div>
    </footer>
  );
};
