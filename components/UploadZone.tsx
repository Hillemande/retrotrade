'use client'

import { useState, useRef } from 'react'

interface Props {
  id: string
  multi?: boolean
  onFilesChange: (files: File[]) => void
  hasError?: boolean
}

export default function UploadZone({ id, multi = false, onFilesChange, hasError }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function updateFiles(newFiles: File[]) {
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  function addFiles(incoming: File[]) {
    const filtered = incoming.filter(f => f.type.startsWith('image/'))
    if (!multi) {
      updateFiles(filtered.slice(0, 1))
    } else {
      updateFiles([...files, ...filtered].slice(0, 10))
    }
  }

  function removeFile(idx: number) {
    const next = files.filter((_, i) => i !== idx)
    updateFiles(next)
  }

  const zoneStyle: React.CSSProperties = hasError ? { borderColor: 'var(--red)' } : {}

  if (files.length === 0) {
    return (
      <>
        <div
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={multi ? 'Upload trøjefotos' : 'Upload foto af produktkode'}
          style={zoneStyle}
          onClick={() => inputRef.current?.click()}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            addFiles(Array.from(e.dataTransfer.files))
          }}
        >
          {multi ? (
            <>
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p><strong>Klik eller træk</strong> trøjefotos hertil</p>
              <p style={{ fontSize: '.8rem' }}>PNG, JPG op til 20MB — max 10 billeder</p>
            </>
          ) : (
            <>
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/></svg>
              <p><strong>Klik eller træk</strong> produktkodefoto hertil</p>
              <p style={{ fontSize: '.8rem' }}>PNG, JPG op til 10MB — 1 billede</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          multiple={multi}
          style={{ display: 'none' }}
          aria-hidden="true"
          onChange={e => {
            addFiles(Array.from(e.target.files || []))
            e.target.value = ''
          }}
        />
      </>
    )
  }

  return (
    <>
      <div className="upload-zone has-files" style={zoneStyle}>
        <div className="upload-preview-grid">
          {files.map((file, idx) => {
            const url = URL.createObjectURL(file)
            return (
              <div key={idx} className="upload-preview-item">
                <img
                  src={url}
                  alt={file.name}
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                <button
                  type="button"
                  className="upload-preview-remove"
                  aria-label={`Fjern ${file.name}`}
                  onClick={e => { e.stopPropagation(); removeFile(idx) }}
                >×</button>
              </div>
            )
          })}
        </div>
        {multi && files.length < 10 && (
          <button
            type="button"
            className="upload-add-more"
            onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Tilføj flere billeder
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple={multi}
        style={{ display: 'none' }}
        aria-hidden="true"
        onChange={e => {
          addFiles(Array.from(e.target.files || []))
          e.target.value = ''
        }}
      />
    </>
  )
}
