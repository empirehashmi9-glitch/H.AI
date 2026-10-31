import React from 'react';
import { SectionHead } from '../../ui/Toon';
import { SettingsPanel } from '../shared/SettingsPanel';

export const AccountPage: React.FC = () => (
  <div className="space-y-5 sm:space-y-6">
    <SectionHead
      eyebrow="Your workspace"
      title="Account & keys"
      sub="Add your own Gemini, Vercel and Supabase keys to switch from demo builds to real AI, deploys and database migrations. Everything stays in this browser."
    />
    <SettingsPanel />
  </div>
);
