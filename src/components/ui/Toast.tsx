'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div 
        className="d-flex align-items-center gap-2 px-4 py-3 rounded shadow"
        style={{ 
          backgroundColor: '#3E3125', 
          color: '#F8F5EF', 
          border: '1px solid #B8895A',
          animation: 'slideIn 0.3s ease'
        }}
      >
        <span>✅</span>
        <span className="fw-medium">{message}</span>
        <button 
          onClick={onClose}
          className="btn btn-sm border-0 ms-2"
          style={{ color: '#F8F5EF', backgroundColor: 'transparent', fontSize: 18, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}