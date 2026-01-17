"use client";

export default function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-gray-800 p-3 md:hidden z-50">
      <a href="/pricing" className="btn-primary w-full">
        Subscribe & Start Bidding
      </a>
    </div>
  );
}
