'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
}

interface AppNavProps {
  items: NavItem[];
}

export function AppNav({ items }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {items.map((item) => {
        const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
              isActive ? 'font-semibold' : 'hover:bg-[#f3f4f5]',
            )}
            style={{ color: isActive ? '#3525cd' : '#464555' }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
