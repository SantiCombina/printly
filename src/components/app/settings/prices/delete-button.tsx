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
      variant="ghost"
      size="icon-sm"
      onClick={onDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-500"
    >
      <Trash2 />
    </Button>
  );
}
