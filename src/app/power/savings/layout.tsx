import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar & Power Savings Simulator | Generator vs Solar Hybrid ROI | 3rd Energy',
  description:
    'Calculate your generator fuel burn vs solar-hybrid ROI. Estimate 1-year, 5-year, and 10-year operational cost savings with our transparent energy comparison simulator.',
};

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
