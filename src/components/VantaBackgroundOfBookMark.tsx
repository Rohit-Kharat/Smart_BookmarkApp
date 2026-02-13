"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import RINGS from "vanta/dist/vanta.rings.min";

export default function VantaBackgroundOfBookMark() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    if (!effectRef.current) {
      effectRef.current = RINGS({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x0f172a, // dark blue background
        color: 0xff3f81, // ring color
      });
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 -z-10"
    />
  );
}
