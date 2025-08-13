// File: PanZoomSVG.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react'
import styles from './PanZoomSVG.module.css'

export default function PanZoomSVG({
  children,
  initialScale = 1,
  minScale = 0.1,
  maxScale = 4,
  wheelZoomSpeed = 0.0015,
  doubleClickZoom = 2,
  className = '',
  onTransform,
}) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  const [{ x, y, scale }, setTransform] = useState({
    x: 0,
    y: 0,
    scale: initialScale,
  })

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

  const applyDomTransform = useCallback((tx, ty, s) => {
    const el = contentRef.current
    if (!el) return
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
    el.style.transformOrigin = '0 0'
    el.style.imageRendering = 'crisp-edges'
  }, [])

  useEffect(() => {
    applyDomTransform(x, y, scale)
    if (onTransform) onTransform({ x, y, scale })
  }, [x, y, scale, applyDomTransform, onTransform])

  // Автоматическое масштабирование при первом рендере, если SVG огромная
  useEffect(() => {
    const container = containerRef.current
    const svgEl = contentRef.current?.querySelector('svg')
    if (container && svgEl) {
      const bbox = svgEl.getBBox()
      if (bbox.width && bbox.height) {
        const scaleX = container.clientWidth / bbox.width
        const scaleY = container.clientHeight / bbox.height
        const fitScale = Math.min(scaleX, scaleY, 1)
        setTransform({
          x: (container.clientWidth - bbox.width * fitScale) / 2,
          y: (container.clientHeight - bbox.height * fitScale) / 2,
          scale: fitScale,
        })
      }
    }
  }, [])

  const draggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })

  const onPointerDown = (e) => {
    const c = containerRef.current
    if (!c) return
    c.setPointerCapture(e.pointerId)
    draggingRef.current = true
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    c.classList.add(styles.grabbing)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    e.preventDefault()
    const last = lastPointerRef.current
    const dx = e.clientX - last.x
    const dy = e.clientY - last.y
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    setTransform((prev) => ({ x: prev.x + dx, y: prev.y + dy, scale: prev.scale }))
  }

  const onPointerUp = (e) => {
    const c = containerRef.current
    if (!c) return
    try { c.releasePointerCapture(e.pointerId) } catch {}
    draggingRef.current = false
    c.classList.remove(styles.grabbing)
  }

  const onWheel = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const pointerX = e.clientX - rect.left
    const pointerY = e.clientY - rect.top

    setTransform((prev) => {
      const oldScale = prev.scale
      const delta = -e.deltaY
      let newScale = oldScale * (1 + delta * wheelZoomSpeed)
      newScale = clamp(newScale, minScale, maxScale)

      const contentPointX = (pointerX - prev.x) / oldScale
      const contentPointY = (pointerY - prev.y) / oldScale

      const newX = pointerX - contentPointX * newScale
      const newY = pointerY - contentPointY * newScale

      return { x: newX, y: newY, scale: newScale }
    })
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      e.preventDefault()
      onWheel(e)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const onDoubleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const pointerX = e.clientX - rect.left
    const pointerY = e.clientY - rect.top

    setTransform((prev) => {
      const targetScale = clamp(prev.scale * doubleClickZoom, minScale, maxScale)
      const contentPointX = (pointerX - prev.x) / prev.scale
      const contentPointY = (pointerY - prev.y) / prev.scale
      const newX = pointerX - contentPointX * targetScale
      const newY = pointerY - contentPointY * targetScale
      return { x: newX, y: newY, scale: targetScale }
    })
  }

  const pinchRef = useRef({})
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      pinchRef.current = {
        active: true,
        startDist: Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY),
        startScale: scale,
        center: { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 },
      }
    }
  }
  const onTouchMove = (e) => {
    if (pinchRef.current.active && e.touches.length === 2) {
      e.preventDefault()
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
      const ratio = dist / pinchRef.current.startDist
      const newScale = clamp(pinchRef.current.startScale * ratio, minScale, maxScale)

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = pinchRef.current.center.x - rect.left
      const centerY = pinchRef.current.center.y - rect.top

      setTransform((prev) => {
        const contentPointX = (centerX - prev.x) / prev.scale
        const contentPointY = (centerY - prev.y) / prev.scale
        const newX = centerX - contentPointX * newScale
        const newY = centerY - contentPointY * newScale
        return { x: newX, y: newY, scale: newScale }
      })
    }
  }
  const onTouchEnd = (e) => {
    if (e.touches.length < 2) pinchRef.current.active = false
  }

  const reset = (opts = {}) => {
    const { scale: s = initialScale, x: nx = 0, y: ny = 0 } = opts
    setTransform({ x: nx, y: ny, scale: s })
  }

  useEffect(() => {
    const handler = (e) => {
      if (document.activeElement !== containerRef.current) return
      if (e.key === 'ArrowUp') setTransform(prev => ({ ...prev, y: prev.y + 20 }))
      if (e.key === 'ArrowDown') setTransform(prev => ({ ...prev, y: prev.y - 20 }))
      if (e.key === 'ArrowLeft') setTransform(prev => ({ ...prev, x: prev.x + 20 }))
      if (e.key === 'ArrowRight') setTransform(prev => ({ ...prev, x: prev.x - 20 }))
      if (e.key === '+' || e.key === '=') setTransform(prev => ({ ...prev, scale: clamp(prev.scale * 1.1, minScale, maxScale) }))
      if (e.key === '-') setTransform(prev => ({ ...prev, scale: clamp(prev.scale / 1.1, minScale, maxScale) }))
      if (e.key === '0') reset()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [initialScale, minScale, maxScale])

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      role="application"
      aria-label="Pan and zoom SVG viewer"
    >
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
      <div className={styles.hint}>Используйте мышь для масштабирования схемы</div>
    </div>
  )
}
