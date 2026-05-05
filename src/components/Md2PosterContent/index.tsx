import { cn } from '../../lib/utils'

interface Md2PosterContentProps {
  children?: React.ReactNode
  className?: string
}

const Md2PosterContent = ({ children, className }: Md2PosterContentProps) => {
  return (
    <div className={cn('flex flex-col bg-white px-4 sm:px-8 py-8 rounded-2xl border shadow-2xl shadow-gray-950/50', className)}>
      {children}
    </div>
  )
}

export type { Md2PosterContentProps }
export default Md2PosterContent
