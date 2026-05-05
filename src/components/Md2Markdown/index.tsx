import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface Md2MarkdownProps {
  children: string
  className?: string
  articleClassName?: string
  imgProxy?: string | false
}

const DEFAULT_PROXY = 'https://api.allorigins.win/raw'

const Md2Markdown = ({
  children,
  className,
  articleClassName = 'prose prose-gray prose-img:rounded-lg prose-img:border prose-img:opacity-100',
  imgProxy = DEFAULT_PROXY,
}: Md2MarkdownProps) => {
  return (
    <article className={className}>
      <div className={articleClassName}>
        <Markdown
          components={
            imgProxy
              ? {
                  img: ({ src, ...rest }) => {
                    const newSrc = src ? `${imgProxy}?url=${encodeURIComponent(src)}` : src
                    return <img {...rest} src={newSrc} />
                  },
                }
              : undefined
          }
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
        >
          {children}
        </Markdown>
      </div>
    </article>
  )
}

export type { Md2MarkdownProps }
export default Md2Markdown
