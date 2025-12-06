import { ThemeProviderProps } from 'next-themes/dist/types';

declare module '@/components/theme-provider' {
  export function ThemeProvider({
    children,
    ...props
  }: ThemeProviderProps): JSX.Element;
}
