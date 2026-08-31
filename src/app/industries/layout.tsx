import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description: 'Energy solutions tailored for commercial, industrial, facility management, institutional, and construction sectors. Learn how 3rd Energy serves your industry.',
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
