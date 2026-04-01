import React from 'react';

function Keycap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-[24px] h-[24px] px-1.5 flex items-center justify-center rounded border border-narto-border bg-transparent text-narto-muted text-xs mx-0.5">
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="flex items-center px-6 py-4 border-t border-narto-border/50 bg-[#0a0a0c] mt-auto">
      <div className="flex items-center space-x-6 text-xs text-narto-muted font-medium tracking-wide">
        <div className="flex items-center uppercase space-x-2">
          <div className="flex items-center">
            <Keycap>↑</Keycap>
            <Keycap>↓</Keycap>
            <Keycap>←</Keycap>
            <Keycap>→</Keycap>
          </div>
          <span>NAVIGATE</span>
        </div>
        <div className="text-narto-border">|</div>
        <div className="flex items-center uppercase space-x-2">
          <Keycap>Enter</Keycap>
          <span>SELECT</span>
        </div>
        <div className="text-narto-border">|</div>
        <div className="flex items-center uppercase space-x-2">
          <Keycap>Esc</Keycap>
          <span>CLOSE</span>
        </div>
      </div>
    </footer>
  );
}
