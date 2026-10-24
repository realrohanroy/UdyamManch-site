import {
  Home, Leaf, Sprout, Zap, Recycle, Users, ChartNoAxesColumn, Factory, Droplet, Sun,
  Flame, Layers, Clock, CircleCheck, Smile, Map, Award, Truck, Shirt, Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/lib/journey/types';

/**
 * Whitelist of icons content may use. Content stores a name ("leaf"), never
 * markup, so editors cannot inject SVG and every icon matches the line style.
 * The `satisfies` check makes TypeScript fail if IconName and this map drift.
 */
const ICONS = {
  home: Home, leaf: Leaf, sprout: Sprout, zap: Zap, recycle: Recycle, users: Users,
  chart: ChartNoAxesColumn, factory: Factory, droplet: Droplet, sun: Sun, flame: Flame,
  layers: Layers, clock: Clock, check: CircleCheck, smile: Smile, map: Map, award: Award,
  truck: Truck, shirt: Shirt, wrench: Wrench,
} satisfies Record<IconName, LucideIcon>;

export function Icon({ name, size = 18, strokeWidth = 2 }: { name: IconName; size?: number; strokeWidth?: number }) {
  const C = ICONS[name] ?? Leaf;
  return <C size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
}
