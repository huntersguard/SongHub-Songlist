import React from 'react';

/**
 * Calculates dynamic font size and letter spacing for table cells
 * so long song titles and artist names smoothly auto-scale down
 * to fit within fixed cell bounds without adding "..." ellipsis or wrapping lines.
 */
export function getAutoFitStyle(
  text: string,
  type: 'title' | 'artist',
  baseFontSize: 'xs' | 'sm' | 'base',
  colWidthPercent: number,
  enabled: boolean
): React.CSSProperties {
  if (!enabled || !text) {
    return {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    };
  }

  const length = text.trim().length;

  // Base font size in pixels depending on the global setting
  const basePx = baseFontSize === 'xs' ? 9.5 : baseFontSize === 'sm' ? 11 : 12;

  // Expected character capacity at 100% font scale
  // Standard title column (52% width) fits roughly 26-28 characters at normal size.
  // Standard artist column (30% width) fits roughly 15-17 characters at normal size.
  const widthRatio = type === 'title' ? colWidthPercent / 52 : colWidthPercent / 30;
  const maxNormalChars = Math.max(12, Math.round((type === 'title' ? 26 : 16) * widthRatio));

  if (length <= maxNormalChars) {
    return {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    };
  }

  // Smooth continuous scaling formula
  // Ratio of available capacity to text length
  const scaleRatio = maxNormalChars / length;

  // Scale down font size smoothly, with a floor of ~5.5px to maintain print readability
  // For moderate overflow (e.g. 30-40 chars), font drops to ~8.5px - 9.5px
  // For long overflow (40-60 chars), font drops to ~6.5px - 7.5px with tighter letter spacing
  const minFontPx = 5.5;
  const calculatedFontPx = Math.max(minFontPx, Math.round(basePx * Math.pow(scaleRatio, 0.88) * 10) / 10);

  // Letter spacing compression for very long text
  let letterSpacing = 'normal';
  if (length > maxNormalChars * 1.5) {
    letterSpacing = '-0.025em';
  } else if (length > maxNormalChars * 1.25) {
    letterSpacing = '-0.015em';
  }

  return {
    fontSize: `${calculatedFontPx}px`,
    lineHeight: '1.1',
    letterSpacing,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  };
}
