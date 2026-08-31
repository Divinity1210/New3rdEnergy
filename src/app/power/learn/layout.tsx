import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Education Hub & Technical Guides | 3rd Energy',
  description:
    'Comprehensive engineering guides on solar power: Inverter vs generator total cost of ownership, lithium vs gel batteries, solar sizing formulas, and installation safety best practices.',
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
