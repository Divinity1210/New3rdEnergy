import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Power Sizing Planner | 3rd Energy',
  description:
    'Size your residential or commercial power system in minutes. Select your appliances, runtime hours, and priority to get a preliminary inverter, battery, and solar panel recommendation.',
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
