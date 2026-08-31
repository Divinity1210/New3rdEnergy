import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Power & Solar Equipment Catalogue | Inverters, LiFePO4 Batteries & Solar Panels',
  description:
    'Browse 3rd Energy verified power equipment: Pure Sine hybrid inverters, Lithium LiFePO4 wall and rack batteries, Tier-1 monocrystalline and bifacial solar panels, and turnkey packages.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
