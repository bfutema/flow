import { createGlobalStyle } from 'styled-components'

/** Scrollbars (Firefox + WebKit) alinhados ao tema claro/escuro do Flow Admin. */
export const GlobalStyles = createGlobalStyle`
  html {
    scrollbar-gutter: stable;
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) =>
      `${theme.mode === 'dark'
        ? `color-mix(in srgb, ${theme.chartAxis} 75%, ${theme.chartGrid})`
        : `color-mix(in srgb, ${theme.chartAxis} 45%, ${theme.border})`} ${theme.bg}`};
  }

  *::-webkit-scrollbar {
    width: 11px;
    height: 11px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.bg};
    border-radius: 999px;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 999px;
    border: 3px solid ${({ theme }) => theme.bg};
    background-clip: padding-box;
    background-color: ${({ theme }) =>
      theme.mode === 'dark'
        ? `color-mix(in srgb, ${theme.chartAxis} 72%, ${theme.chartGrid})`
        : `color-mix(in srgb, ${theme.chartAxis} 38%, ${theme.border})`};
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) =>
      `color-mix(in srgb, ${theme.primary} 42%, ${
        theme.mode === 'dark'
          ? `color-mix(in srgb, ${theme.chartAxis} 72%, ${theme.chartGrid})`
          : `color-mix(in srgb, ${theme.chartAxis} 38%, ${theme.border})`
      })`};
  }

  *::-webkit-scrollbar-thumb:active {
    background-color: ${({ theme }) =>
      `color-mix(in srgb, ${theme.primary} 58%, ${theme.chartGrid})`};
  }

  *::-webkit-scrollbar-corner {
    background: ${({ theme }) => theme.bg};
  }
`
