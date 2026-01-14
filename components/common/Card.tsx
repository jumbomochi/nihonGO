import { View } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm ${className}`}
    >
      {children}
    </View>
  );
}
