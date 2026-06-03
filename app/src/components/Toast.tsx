"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onHide, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  );
}
