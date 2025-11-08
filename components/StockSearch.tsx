'use client'

import { useState } from 'react'
import { popularStocks } from '@/lib/stockData'

interface StockSearchProps {
  onStockSelect: (symbol: string) => void
}

export default function StockSearch({ onStockSelect }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredStocks = popularStocks.filter(stock =>
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (symbol: string) => {
    setSearchTerm(symbol)
    onStockSelect(symbol)
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search stocks (e.g., AAPL, TSLA, GOOGL)..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {showSuggestions && searchTerm && (
            <div className="absolute top-full mt-2 w-full bg-slate-800 rounded-lg shadow-xl border border-white/10 z-50 max-h-60 overflow-y-auto">
              {filteredStocks.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSelect(symbol)}
                  className="w-full px-4 py-3 text-left text-white hover:bg-purple-600 transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => searchTerm && onStockSelect(searchTerm)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {popularStocks.slice(0, 8).map((symbol) => (
          <button
            key={symbol}
            onClick={() => handleSelect(symbol)}
            className="px-3 py-1.5 bg-white/5 text-white text-sm rounded-full hover:bg-white/10 transition-colors border border-white/10"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  )
}
