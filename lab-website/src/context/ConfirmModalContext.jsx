import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ConfirmModalContext = createContext(null)

export function ConfirmModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: 'Confirm Deletion',
    message: 'Do you want to delete this? This action cannot be undone.',
    confirmText: 'Yes',
    cancelText: 'No',
    danger: true,
    resolve: null,
  })

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      let config = {}
      if (typeof options === 'string') {
        config = { message: options }
      } else if (options && typeof options === 'object') {
        config = options
      }

      setModalState({
        isOpen: true,
        title: config.title || (config.danger === false ? 'Confirm Action' : 'Confirm Deletion'),
        message: config.message || 'Do you want to delete this? This action cannot be undone.',
        confirmText: config.confirmText || 'Yes',
        cancelText: config.cancelText || 'No',
        danger: config.danger !== false,
        resolve,
      })
    })
  }, [])

  const handleClose = useCallback((result) => {
    setModalState(prev => {
      if (prev.resolve) {
        prev.resolve(result)
      }
      return { ...prev, isOpen: false, resolve: null }
    })
  }, [])

  // Keyboard navigation: Escape cancels
  useEffect(() => {
    if (!modalState.isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modalState.isOpen, handleClose])

  return (
    <ConfirmModalContext.Provider value={confirm}>
      {children}

      {modalState.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => handleClose(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(13, 27, 42, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'confirmFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '430px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(13, 27, 42, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              animation: 'confirmScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {/* Modal Content */}
            <div style={{ padding: '2rem 1.75rem 1.5rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 1.25rem',
                  borderRadius: '50%',
                  backgroundColor: modalState.danger ? '#fee2e2' : '#e0e7ff',
                  color: modalState.danger ? '#dc2626' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.85rem',
                  boxShadow: modalState.danger ? '0 4px 14px rgba(239, 68, 68, 0.2)' : '0 4px 14px rgba(37, 99, 235, 0.2)',
                }}
              >
                {modalState.danger ? '🗑️' : '❓'}
              </div>

              <h3
                style={{
                  margin: '0 0 0.6rem',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {modalState.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.93rem',
                  color: 'var(--gray-600)',
                  lineHeight: 1.6,
                }}
              >
                {modalState.message}
              </p>
            </div>

            {/* Actions: No / Yes */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '1.1rem 1.75rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                onClick={() => handleClose(false)}
                style={{
                  flex: 1,
                  padding: '0.7rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-300)',
                  backgroundColor: '#ffffff',
                  color: 'var(--gray-700)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                  e.currentTarget.style.borderColor = 'var(--gray-400)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.borderColor = 'var(--gray-300)'
                }}
              >
                {modalState.cancelText}
              </button>

              <button
                type="button"
                autoFocus
                onClick={() => handleClose(true)}
                style={{
                  flex: 1,
                  padding: '0.7rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: modalState.danger ? '#dc2626' : 'var(--navy)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: modalState.danger ? '0 4px 14px rgba(220, 38, 38, 0.35)' : '0 4px 14px rgba(13, 27, 42, 0.25)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.12)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                {modalState.confirmText}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes confirmFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes confirmScaleIn {
              from { opacity: 0; transform: scale(0.92) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </ConfirmModalContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmModalContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmModalProvider')
  }
  return context
}
