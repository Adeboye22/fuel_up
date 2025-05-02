import { Droplet } from 'lucide-react'
import React from 'react'

const FuelupLogo2 = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-3">
        {/* Logo container with gradient background */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          {/* Animated fuel droplet icon */}
          <div
            className={`absolute transition-all duration-1000`}
          >
            <Droplet className="w-6 h-6 text-white fill-white/30 stroke-[2.5]" />
          </div>

          {/* Energy bolt overlay */}
          {/* <div className={`absolute transition-all duration-700`}>
            <ZapFast className="w-6 h-6 text-yellow-300 stroke-[2.5]" />
          </div> */}
        </div>

        {/* Text part of the logo */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight">
            FuelUp
          </span>
          <span className="text-xs uppercase tracking-widest text-emerald-400">Instant Delivery</span>
        </div>
      </div>
    </div>
  )
}

export default FuelupLogo2
