// Toolbar.tsx
import React from 'react'

interface ToolbarProps {
  penColor: string
  setPenColor: (color: string) => void
  penWidth: number
  setPenWidth: (width: number) => void
}

const Toolbar: React.FC<ToolbarProps> = ({
  penColor,
  setPenColor,
  penWidth,
  setPenWidth
}) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <div>
        <label className="block text-sm font-medium">Pen Color</label>
        <input
          type="color"
          value={penColor}
          onChange={e => setPenColor(e.target.value)}
          className="w-10 h-10 p-0 border-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Pen Width</label>
        <input
          type="range"
          min="1"
          max="20"
          value={penWidth}
          onChange={e => setPenWidth(Number(e.target.value))}
          className="w-32"
        />
        <span className="ml-2 text-sm">{penWidth}px</span>
      </div>
    </div>
  )
}

export default Toolbar
