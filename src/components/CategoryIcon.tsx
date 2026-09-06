import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Gamepad2,
  GraduationCap,
  Receipt,
  Sparkles,
  Smartphone,
  Palmtree,
  ShieldCheck,
  Laptop,
  PiggyBank,
  Wallet,
  LucideIcon,
} from 'lucide-react';
import { Category } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';

interface CategoryIconProps {
  category: Category | string;
  size?: number;
  className?: string;
  withBackground?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  ShoppingBag,
  Car,
  Gamepad2,
  GraduationCap,
  Receipt,
  Sparkles,
  Smartphone,
  Palmtree,
  ShieldCheck,
  Laptop,
  PiggyBank,
  Wallet,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 18,
  className = '',
  withBackground = false,
}) => {
  const details = CATEGORY_DETAILS[category as Category];
  const iconName = details ? details.icon : 'Sparkles';
  const IconComponent = ICON_MAP[iconName] || Sparkles;

  if (withBackground && details) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl p-2.5 transition-colors ${details.bgColor} ${details.darkBgColor} ${className}`}
      >
        <IconComponent size={size} strokeWidth={2.2} />
      </div>
    );
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={2.2}
      className={className}
      style={details ? { color: details.color } : undefined}
    />
  );
};
