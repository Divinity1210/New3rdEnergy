import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Energy Intelligence & Industry Insights | 3rd Energy',
  description: 'Expert analysis, market intelligence, regulatory guidelines, and technical briefs on commercial petroleum supply and hybrid power systems from 3rd Energy advisory team.',
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
