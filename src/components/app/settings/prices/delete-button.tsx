'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export function DeleteButton({ onDelete, isDeleting }: DeleteButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onDelete}
      disabled={isDeleting}
      className="size-8 rounded-full disabled:opacity-40"
      style={{ color: '#777587' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#ffdad6';
        e.currentTarget.style.color = '#ba1a1a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#777587';
      }}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
}
