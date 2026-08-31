import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI System Builder | Custom Solar & Battery Configurator | 3rd Energy',
  description:
    'Design and customize your bespoke solar hybrid system live. Adjust battery capacity, backup runtime, and solar panel arrays to match your exact budget and load.',
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
