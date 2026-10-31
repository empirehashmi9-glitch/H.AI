import React from 'react';

const HudLayer: React.FC<{ variant: 'customer' | 'admin' | 'landing' }> = ({ variant }) => (
  <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden sky-${variant}`} aria-hidden="true">
    <div className="absolute inset-0 hud-grid opacity-80" />
    <div className="absolute inset-0 hud-vignette" />

    <div className="absolute -top-56 left-1/2 h-[36rem] w-[80rem] -translate-x-1/2 rounded-full bg-aqua/[0.06] blur-[120px]" />
    {variant !== 'admin' && (
      <div className="absolute right-[-18rem] top-1/4 h-[34rem] w-[34rem] rounded-full bg-grape/[0.05] blur-[120px]" />
    )}
    {variant === 'landing' && (
      <div className="absolute bottom-[-16rem] left-[-12rem] h-[32rem] w-[32rem] rounded-full bg-mint/[0.04] blur-[110px]" />
    )}

    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#020a11]/75 to-transparent" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua/35 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-aqua/15 to-transparent" />
    <span className="hud-corner tl absolute left-4 top-4 hidden sm:block" />
    <span className="hud-corner tr absolute right-4 top-4 hidden sm:block" />
  </div>
);

export const CustomerBackdrop: React.FC = () => <HudLayer variant="customer" />;

export const AdminBackdrop: React.FC = () => <HudLayer variant="admin" />;

export const LandingBackdrop: React.FC = () => <HudLayer variant="landing" />;
