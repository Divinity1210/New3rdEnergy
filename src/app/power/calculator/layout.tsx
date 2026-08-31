import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Power & Energy Sizing Calculator | 3rd Energy',
  description:
    'Calculate your total running watts, surge peak, and daily kilowatt-hour consumption with our transparent appliance audit calculator.',
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
