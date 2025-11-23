"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export function QRCodeComponent({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      const QRCode = (await import("qrcode")).default
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, value, { width: size })
      }
    }

    generateQRCode().catch(console.error)
  }, [value, size])

  return <canvas ref={canvasRef} />
}
