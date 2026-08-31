import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Power & Solar Equipment | Technical Spec Matrix | 3rd Energy',
  description:
    'Compare inverters, lithium batteries, and solar panels side-by-side. Compare continuous power, surge capacity, battery cycles, efficiency, and warranty ratings.',
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
