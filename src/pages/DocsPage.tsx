'use client'

import { useRef, useState, useCallback, type ReactNode } from 'react'
import { Md2Poster, Md2PosterContent, Md2Markdown } from '../components'

function PosterAutoScale({ children, width }: { children: ReactNode; width: number }) {
  const innerRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    const updateScale = () => {
      const containerW = parent.clientWidth - 64
      const containerH = parent.clientHeight - 64
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
  }, [width])

  return (
    <div className="shrink-0" style={{ width: `${width}px` }}>
      <div ref={innerRef} style={{ transformOrigin: 'top left' }}>
        {children}
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
  const posterRef = useRef<any>(null)

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm shrink-0 z-10">
        <h1 className="text-lg font-semibold text-gray-700">PostMD</h1>
        <div className="flex gap-2">
          <button
            onClick={() => posterRef?.current?.handleCopy()}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => posterRef?.current?.handleDownload()}
            className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Download
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[35%] flex flex-col bg-white border-r border-gray-200">
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

        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
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

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">Scale</span>
              {SCALES.map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    scale === s
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-500 bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mr-1">Width</span>
              <input
                type="range"
                min={320}
                max={800}
                step={10}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-32 accent-indigo-600"
              />
              <span className="text-xs font-mono text-gray-500 w-10 text-right">{width}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            <PosterAutoScale width={width}>
              <Md2Poster
                theme={activeTheme as any}
                scale={scale}
                ref={posterRef}
              >
                <Md2PosterContent>
                  <Md2Markdown>{markdown}</Md2Markdown>
                </Md2PosterContent>
              </Md2Poster>
            </PosterAutoScale>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocsPage
