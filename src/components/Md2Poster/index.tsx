import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { cn } from '../../lib/utils'
import { domToBlob } from 'modern-screenshot'

type IThemeType =
  | 'blue' | 'pink' | 'purple' | 'green' | 'yellow' | 'gray' | 'red' | 'indigo'
  | 'SpringGradientWave'

type IAspectRatioType = 'auto' | '16/9' | '1/1' | '4/3'

interface Md2PosterProps {
  children?: React.ReactNode
  className?: string
  theme?: IThemeType
  aspectRatio?: IAspectRatioType
  padding?: 'sm' | 'lg'
  scale?: number
}

interface Md2PosterRef {
  handleCopy: () => Promise<Blob>
  handleDownload: (filename?: string) => Promise<void>
}

const themeMapClassName: Record<IThemeType, string> = {
  blue: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500',
  pink: 'bg-gradient-to-br from-pink-600/80 via-red-400/80 to-pink-600/60',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-700',
  green: 'bg-gradient-to-br from-green-600/80 to-green-800/80',
  yellow: 'bg-gradient-to-br from-yellow-500 via-orange-300 to-yellow-500',
  gray: 'bg-gradient-to-br from-black/90 via-gray-700 to-black/90',
  red: 'bg-gradient-to-r from-red-500 to-orange-500',
  indigo: 'bg-gradient-to-br from-indigo-700 via-blue-600/80 to-indigo-700',
  SpringGradientWave: 'bg-spring-gradient-wave bg-cover',
}

const aspectRatioMapClassName: Record<IAspectRatioType, string> = {
  auto: 'aspect-auto',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
}

const paddingMapClassName: Record<string, string> = {
  sm: 'p-6',
  lg: 'p-16',
}

const Md2Poster = forwardRef<Md2PosterRef, Md2PosterProps>(
  ({ children, theme = 'blue', className, aspectRatio = 'auto', padding = 'sm', scale = 2 }, ref) => {
    const mdRef = useRef<HTMLDivElement>(null)

    const snapshot = useCallback(async (): Promise<Blob> => {
      const el = mdRef.current
      if (!el) throw new Error('Md2Poster ref is not mounted')
      // Find and temporarily disable any CSS transforms applied by preview scaling (PosterAutoScale)
      let scaledParent: HTMLElement | null = el.parentElement
      const savedTransforms: { el: HTMLElement; transform: string }[] = []
      while (scaledParent) {
        const t = getComputedStyle(scaledParent).transform
        if (t && t !== 'none') {
          savedTransforms.push({ el: scaledParent, transform: scaledParent.style.transform })
          scaledParent.style.transform = 'none'
        }
        scaledParent = scaledParent.parentElement
      }
      await new Promise((r) => setTimeout(r, 100))
      const blob = (await domToBlob(el, { scale })) as Blob
      // Restore transforms
      for (const { el, transform } of savedTransforms) {
        el.style.transform = transform
      }
      return blob
    }, [scale])

    const handleCopy = useCallback(async (): Promise<Blob> => {
      const blob = await snapshot()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return blob
    }, [snapshot])

    const handleDownload = useCallback(async (filename = 'poster') => {
      const blob = await snapshot()
      const suffix = scale > 1 ? `@${scale}x` : ''
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}${suffix}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, [snapshot, scale])

    useImperativeHandle(ref, () => ({ handleCopy, handleDownload }), [handleCopy, handleDownload])

    return (
      <div className="postmd">
        <div
          ref={mdRef}
          className={cn(
            'w-full relative',
            themeMapClassName[theme],
            aspectRatioMapClassName[aspectRatio],
            paddingMapClassName[padding],
            className,
          )}
        >
          {children}
        </div>
      </div>
    )
  },
)

export type { Md2PosterProps, Md2PosterRef, IThemeType, IAspectRatioType }
export default Md2Poster
