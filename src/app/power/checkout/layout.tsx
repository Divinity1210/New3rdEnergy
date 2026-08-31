import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Power System Checkout | 3rd Energy',
  description: 'Complete your power equipment order with nationwide delivery or depot collection.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
