import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Product Concierge | Power & Solar Technical Assistant | 3rd Energy',
  description:
    'Ask technical equipment compatibility questions, battery sizing, inverter specifications, and get verified engineering answers from our AI Power Concierge.',
};

export default function ConciergeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
