export default function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg"
    >
      {/* ตัวเลข counter */}
      <span
        id="preloader-counter"
        className="font-heading text-text-primary select-none"
        style={{ fontSize: "clamp(80px, 20vw, 280px)" }}
      >
        0
      </span>
    </div>
  )
}