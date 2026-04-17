'use client';

import { DollarSign, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SettingsNavProps {
  activeSection: 'prices' | 'sellers';
  onSectionChange: (section: 'prices' | 'sellers') => void;
}

const navItems: { label: string; section: 'prices' | 'sellers'; icon: typeof DollarSign }[] = [
  { label: 'Precios', section: 'prices', icon: DollarSign },
  { label: 'Vendedores', section: 'sellers', icon: Users },
];

export function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
  return (
    <aside
      className="w-56 shrink-0 self-start sticky top-6 bg-white rounded-2xl p-3"
      style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}
    >
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onSectionChange(item.section)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors w-full text-left',
                isActive ? 'text-white' : 'hover:bg-[#f3f4f5]',
              )}
              style={
                isActive
                  ? { background: '#eef0fd', color: '#3525cd' }
                  : { color: '#464555' }
              }
            >
              <Icon
                className="size-4 shrink-0"
                style={isActive ? { color: '#3525cd' } : { color: '#777587' }}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
