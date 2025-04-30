'use client';

import React from 'react';
import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Define a type for the props, accepting any key from the imported icons module
interface LucideIconProps extends LucideProps {
  name: keyof typeof icons;
}

const LucideIcon: React.FC<LucideIconProps> = ({ name, ...props }) => {
  const IconComponent = icons[name] as React.ComponentType<LucideProps> | undefined;

  if (!IconComponent) {
    // Optionally return a default icon or null if the name is invalid
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null; // Or return a default fallback icon component
  }

  return <IconComponent {...props} />;
};

export default LucideIcon;
