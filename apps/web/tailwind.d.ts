// https://github.com/tailwindlabs/tailwindcss/pull/15318
declare module 'tailwindcss/lib/util/flattenColorPalette' {
  export default function flattenColorPalette(
    pallette: Record<string, string>
  ): Record<string, string>
}
