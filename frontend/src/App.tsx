import { useLenis } from "./hooks/useLenis"

export default function App() {
  useLenis()

  return (
    <div className="bg-bg min-h-screen">
      <h1 className="font-heading text-text-primary p-8">
        Portfolio — Setup ✓
      </h1>
    </div>
  )
}