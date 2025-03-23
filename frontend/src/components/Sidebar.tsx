import { useState } from 'react'
import sidebarIcon from '@/assets/sidebar-icon.png'
import { Tooltip } from 'react-tooltip'
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const sidebarToggleButton = (
    <a
      data-tooltip-id="my-tooltip"
      data-tooltip-content={isOpen ? '사이드 바 닫기' : '사이드 바 열기'}
      data-tooltip-place="top">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2">
        {/* {isOpen ? '닫기' : '열기'} */}
        <img
          src={sidebarIcon}
          className="w-10"
          alt="사이드 바 열기"
        />
      </button>
    </a>
  )

  return (
    <div className="relative">
      <div className="fixed-left-0 top-0">{sidebarToggleButton}</div>

      <aside
        className={`fixed left-0 top-0 h-full w-60 bg-slate-100 rounded-r-2xl text-white p-5 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {sidebarToggleButton}

        {/* 네비게이션 메뉴 */}
        <nav>
          <ul>
            <li className="p-2 text-black hover:bg-slate-300 hover:text-white">
              <a href="/">Home</a>
            </li>
            <li className="p-2 text-black hover:bg-slate-300 hover:text-white">
              <a href="/about">About</a>
            </li>
            <li className="p-2 text-black hover:bg-slate-300 hover:text-white">
              서비스
            </li>
            <li className="p-2 text-black hover:bg-slate-300 hover:text-white">
              문의
            </li>
          </ul>
        </nav>
      </aside>
      <Tooltip id="my-tooltip" />
    </div>
  )
}
