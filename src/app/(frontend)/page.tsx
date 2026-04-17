import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingPricing } from '@/components/landing/landing-pricing';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingPricing />
      <LandingFooter />
    </div>
  );
}
