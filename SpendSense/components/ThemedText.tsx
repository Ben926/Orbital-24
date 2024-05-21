import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333', // Dark grey color for default text
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#333333', // Dark grey color for semi-bold text
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40, // Increased line height for better readability
    color: '#0a7ea4', // Blue color matching the logo
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28, // Increased line height for better readability
    color: '#008000', // Green color matching the logo
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: '#0a7ea4', // Blue color for links
    textDecorationLine: 'underline', // Underline for links to emphasize clickable text
  },
});