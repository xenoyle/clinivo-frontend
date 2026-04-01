import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from "./layout/Navbar";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />   {/* ← Navbar now renders at the top */}

      {






      }

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
