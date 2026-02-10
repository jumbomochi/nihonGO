import { Text as RNText } from 'react-native';
import { typography, colors } from '@/constants/tokens';

interface TextProps {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'label';
  japanese?: boolean;
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'error';
  className?: string;
  children: React.ReactNode;
}

const colorMap: Record<NonNullable<TextProps['color']>, string> = {
  primary: colors.text.primary.className,
  secondary: colors.text.secondary.className,
  muted: colors.text.muted.className,
  accent: colors.text.accent.className,
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
};

const isHeading = (v: string) =>
  v === 'heading1' || v === 'heading2' || v === 'heading3';

export function Text({
  variant = 'body',
  japanese = false,
  color = 'primary',
  className = '',
  children,
}: TextProps) {
  return (
    <RNText
      className={`${typography[variant]} ${colorMap[color]} ${japanese ? typography.japanese : ''} ${className}`}
      accessibilityRole={isHeading(variant) ? 'header' : undefined}
      maxFontSizeMultiplier={isHeading(variant) ? 1.5 : undefined}
    >
      {children}
    </RNText>
  );
}
