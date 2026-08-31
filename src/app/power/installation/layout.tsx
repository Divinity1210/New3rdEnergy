import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Turnkey Solar Installation | Certified Engineering Site Audit | 3rd Energy',
  description:
    'Book certified solar and power installation across Nigeria. Professional electrical site audit, roof structural analysis, DC lightning protection, and system commissioning.',
};

export default function InstallationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
