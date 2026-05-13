'use client'

import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Md2Poster, Md2PosterContent, Md2Markdown } from '../components'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

function PosterAutoScale({ children, width, padding = 64 }: { children: ReactNode; width: number; padding?: number }) {
  const innerRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    const updateScale = () => {
      const containerW = parent.clientWidth - padding
      const containerH = parent.clientHeight - padding
      el.style.transform = ''
      const h = el.scrollHeight
      const scaleX = containerW / width
      const scaleY = containerH / h
      const s = Math.min(scaleX, scaleY, 1)
      el.style.transform = `scale(${s})`
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    ro.observe(parent)
    ro.observe(el)
    document.fonts?.ready?.then(updateScale)
  }, [width, padding])

  return (
    <div className="shrink-0" style={{ width: `${width}px` }}>
      <div ref={innerRef} style={{ transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  )
}

function EditorPanel({ markdown, setMarkdown }: { markdown: string; setMarkdown: (v: string) => void }) {
  return (
    <div className="flex flex-col bg-white h-full">
      <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400 bg-gray-50 border-b border-gray-100 shrink-0">
        <span>Editor</span>
        <span className="text-gray-300">{markdown.length} chars</span>
      </div>
      <textarea
        className="flex-1 w-full p-5 font-mono text-[13px] leading-7 resize-none focus:outline-none text-gray-700 placeholder-gray-300"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type your markdown here..."
        spellCheck={false}
      />
    </div>
  )
}

function PreviewPanel({
  activeTheme,
  setActiveTheme,
  scale,
  width,
  setWidth,
  cardMargin,
  setCardMargin,
  posterRef,
  markdown,
  mobile,
}: {
  activeTheme: string
  setActiveTheme: (v: string) => void
  scale: number
  width: number
  setWidth: (v: number) => void
  cardMargin: number
  setCardMargin: (v: number) => void
  posterRef: React.MutableRefObject<any>
  markdown: string
  mobile?: boolean
}) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-100 to-gray-200">
      <div className={`flex items-center gap-3 px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 shrink-0 ${mobile ? 'overflow-x-auto flex-nowrap' : ''}`}>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">Theme</span>
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTheme(t.value)}
              title={t.name}
              className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                activeTheme === t.value ? 'border-indigo-500 scale-110 ring-2 ring-indigo-200' : 'border-white/60'
              }`}
              style={{ background: t.gradient }}
            />
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">Width</span>
          <input
            type="range"
            min={320}
            max={1200}
            step={10}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className={`${mobile ? 'w-24' : 'w-32'} accent-indigo-600`}
          />
          <span className="text-xs font-mono text-gray-500 w-12 text-right">{width}px</span>
        </div>

        <div className="w-px h-5 bg-gray-200 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">Margin</span>
          <input
            type="range"
            min={0}
            max={48}
            step={2}
            value={cardMargin}
            onChange={(e) => setCardMargin(Number(e.target.value))}
            className={`${mobile ? 'w-24' : 'w-32'} accent-indigo-600`}
          />
          <span className="text-xs font-mono text-gray-500 w-10 text-right">{cardMargin}px</span>
        </div>
      </div>

      <div className={`flex-1 overflow-auto flex items-start justify-center ${mobile ? 'p-3' : 'p-8'}`}>
        <PosterAutoScale width={width} padding={mobile ? 24 : 64}>
          <Md2Poster
            theme={activeTheme as any}
            scale={scale}
            ref={posterRef}
          >
            <Md2PosterContent margin={cardMargin}>
              <Md2Markdown>{markdown}</Md2Markdown>
            </Md2PosterContent>
          </Md2Poster>
        </PosterAutoScale>
      </div>
    </div>
  )
}

const DEFAULT_MARKDOWN = `# 读书：\`原则\`

> "痛苦 + 反思 = 进步"

瑞·达利欧在\`原则\`里提到的核心观点，也是全书的精华所在。

**痛苦不是终点，而是信号。**

遇到挫折时，人的本能反应是逃避或防御。但如果能停下来问一句：

- 我哪里做错了？
- 是认知盲区还是执行偏差？
- 下次如何改进？

每一次失败，就都能变成升级的台阶。

达利欧把这套方法论用在了桥水基金的日常运营中，也写进了自己的原则清单：

1. 拥抱现实，不要回避
2. 用极度开放的心态看待分歧
3. 通过试错快速迭代

把生活当作一场实验，而不是一场考试。心态变了，很多事就好办了。

---

*随手记，2026年5月。*
`

const THEMES = [
  { value: 'blue', name: 'Blue', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4, #3b82f6)' },
  { value: 'pink', name: 'Pink', gradient: 'linear-gradient(135deg, #db2777cc, #f87171cc, #db277799)' },
  { value: 'purple', name: 'Purple', gradient: 'linear-gradient(to right, #9333ea, #7e22ce)' },
  { value: 'green', name: 'Green', gradient: 'linear-gradient(135deg, #16a34acc, #166534cc)' },
  { value: 'yellow', name: 'Yellow', gradient: 'linear-gradient(135deg, #eab308, #fdba74, #eab308)' },
  { value: 'gray', name: 'Gray', gradient: 'linear-gradient(135deg, #000000e6, #374151, #000000e6)' },
  { value: 'red', name: 'Red', gradient: 'linear-gradient(to right, #ef4444, #f97316)' },
  { value: 'indigo', name: 'Indigo', gradient: 'linear-gradient(135deg, #4338ca, #2563ebcc, #4338ca)' },
  { value: 'SpringGradientWave', name: 'Spring', gradient: 'linear-gradient(135deg, #10b981, #34d399, #f97316)' },
]

const SCALES = [1, 2, 3]

function DocsPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [activeTheme, setActiveTheme] = useState('SpringGradientWave')
  const [scale, setScale] = useState(2)
  const [width, setWidth] = useState(480)
  const [cardMargin, setCardMargin] = useState(0)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const posterRef = useRef<any>(null)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (!showDownloadMenu) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target?.closest('[data-download-menu]')) {
        setShowDownloadMenu(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showDownloadMenu])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white shadow-sm shrink-0 z-10 gap-2">
        <h1 className="text-lg font-semibold text-gray-700">PostMD</h1>
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5 shrink-0">
            {SCALES.map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  scale === s
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <div
            className="relative"
            data-download-menu
            onMouseEnter={() => { if (isDesktop) setShowDownloadMenu(true) }}
            onMouseLeave={() => { if (isDesktop) setShowDownloadMenu(false) }}
          >
            <button
              onClick={() => { if (!isDesktop) setShowDownloadMenu((v) => !v) }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              下载图片
              <svg className="w-3 h-3 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showDownloadMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {showDownloadMenu && (
              <div className="fixed right-4 top-14 sm:absolute sm:right-0 sm:top-full sm:mt-0.5 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[100]">
                <button
                  onClick={() => { posterRef?.current?.handleCopy(); setShowDownloadMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  复制图片
                </button>
                <button
                  onClick={() => { posterRef?.current?.handleDownload(); setShowDownloadMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  保存到本地
                </button>
              </div>
            )}
          </div>
          <a
            href="https://github.com/vv13/postmd"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className="text-xs font-medium">Star</span>
          </a>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {isDesktop ? (
          <Group orientation="horizontal" id="main-layout">
            <Panel defaultSize="35%" minSize="20%" maxSize="70%" id="editor">
              <EditorPanel markdown={markdown} setMarkdown={setMarkdown} />
            </Panel>
            <Separator className="w-[10px] bg-gray-200 hover:bg-indigo-400 active:bg-indigo-500 cursor-col-resize transition-colors" />
            <Panel>
              <PreviewPanel
                activeTheme={activeTheme}
                setActiveTheme={setActiveTheme}
                scale={scale}
                width={width}
                setWidth={setWidth}
                cardMargin={cardMargin}
                setCardMargin={setCardMargin}
                posterRef={posterRef}
                markdown={markdown}
              />
            </Panel>
          </Group>
        ) : (
          <div className="flex flex-col h-full">
            <div className="h-[40vh] shrink-0">
              <EditorPanel markdown={markdown} setMarkdown={setMarkdown} />
            </div>
            <div className="h-1 bg-gray-200 shrink-0" />
            <div className="flex-1 min-h-0">
              <PreviewPanel
                activeTheme={activeTheme}
                setActiveTheme={setActiveTheme}
                scale={scale}
                width={width}
                setWidth={setWidth}
                cardMargin={cardMargin}
                setCardMargin={setCardMargin}
                posterRef={posterRef}
                markdown={markdown}
                mobile
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocsPage
