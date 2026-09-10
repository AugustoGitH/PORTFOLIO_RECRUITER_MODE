import type { AutoRepositionConfig, AutoRepositionOnOverflow } from '../types'

export type GetAutoRepositionConfigOptions = {
  autoRepositionOnOverflow?: AutoRepositionOnOverflow
  overflowPadding?: number
}

export const getAutoRepositionConfig = (
  options: GetAutoRepositionConfigOptions
): AutoRepositionConfig => {
  const { autoRepositionOnOverflow, overflowPadding } = options

  if (!autoRepositionOnOverflow) {
    return {
      enabled: false,
    }
  }

  if (typeof autoRepositionOnOverflow === 'boolean') {
    return {
      enabled: autoRepositionOnOverflow,
      verticalFallback: 'flip',
      padding: overflowPadding ?? 16,
    }
  }

  return {
    enabled: true,
    verticalFallback: 'flip',
    padding: overflowPadding ?? 16,
    ...autoRepositionOnOverflow,
  }
}
