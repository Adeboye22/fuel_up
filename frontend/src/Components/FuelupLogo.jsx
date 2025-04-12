import { Fuel } from 'lucide-react'
import React from 'react'

const FuelupLogo = () => {
  return (
    <div
      className="flex items-center gap-3"
    >
      {/* Modern circular logo with fuel nozzle icon */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg overflow-hidden">
          <div className={`transition-all duration-500`}>
            <Fuel className="w-6 h-6 text-white" />
          </div>

          {/* Animated fuel drop effect */}
          <div
            className={`absolute bottom-0 w-full h-0 bg-emerald-300/30 transition-all duration-700 ease-out rounded-full`}
          />
        </div>
      </div>

      {/* Modern typography */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          <span className="text-emerald-400">Fuel</span>Up
        </h2>
        <p className="text-xs text-gray-400 tracking-wider">Instant Fuel DELIVERY</p>
      </div>
    </div>
  )
}

export default FuelupLogo
