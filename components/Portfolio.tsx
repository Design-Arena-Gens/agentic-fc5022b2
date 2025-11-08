'use client'

import { useState, useEffect } from 'react'
import { PortfolioManager } from '@/lib/portfolio'
import { generateMockStockData } from '@/lib/stockData'
import { PortfolioHolding } from '@/lib/types'

export default function Portfolio() {
  const [portfolio] = useState(() => {
    const pm = new PortfolioManager(100000)
    // Add some sample holdings
    pm.buy('AAPL', 50, 175)
    pm.buy('GOOGL', 30, 140)
    pm.buy('MSFT', 40, 380)
    pm.buy('TSLA', 25, 240)
    return pm
  })

  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeSymbol, setTradeSymbol] = useState('')
  const [tradeShares, setTradeShares] = useState('')
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY')

  useEffect(() => {
    // Update prices periodically
    const interval = setInterval(() => {
      holdings.forEach(h => {
        const stockData = generateMockStockData(h.symbol)
        portfolio.updatePrice(h.symbol, stockData.price)
      })
      setHoldings([...portfolio.getHoldings()])
    }, 3000)

    // Initial load
    setHoldings(portfolio.getHoldings())

    return () => clearInterval(interval)
  }, [portfolio, holdings])

  const handleTrade = () => {
    const shares = parseInt(tradeShares)
    if (!tradeSymbol || !shares || shares <= 0) return

    const stockData = generateMockStockData(tradeSymbol)

    if (tradeType === 'BUY') {
      portfolio.buy(tradeSymbol, shares, stockData.price)
    } else {
      portfolio.sell(tradeSymbol, shares, stockData.price)
    }

    setHoldings([...portfolio.getHoldings()])
    setShowTradeModal(false)
    setTradeSymbol('')
    setTradeShares('')
  }

  const totalValue = portfolio.getTotalValue()
  const cash = portfolio.getCash()
  const gainLoss = portfolio.getGainLoss()
  const gainLossPercent = (gainLoss / (totalValue - gainLoss)) * 100

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Portfolio Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6">
            <div className="text-white/80 text-sm mb-1">Total Value</div>
            <div className="text-white font-bold text-3xl">${totalValue.toFixed(2)}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1">Available Cash</div>
            <div className="text-white font-bold text-2xl">${cash.toFixed(2)}</div>
          </div>

          <div className={`bg-white/5 rounded-xl p-6 ${gainLoss >= 0 ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}>
            <div className="text-slate-400 text-sm mb-1">Total Gain/Loss</div>
            <div className={`font-bold text-2xl ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${Math.abs(gainLoss).toFixed(2)}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-1">Return</div>
            <div className={`font-bold text-2xl ${gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowTradeModal(true)}
          className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          + Execute Trade
        </button>
      </div>

      {/* Holdings Table */}
      <div className="glass-effect rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Holdings</h3>

        {holdings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <p className="text-slate-300 text-lg">No holdings yet. Execute your first trade to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-300 font-semibold py-3 px-4">Symbol</th>
                  <th className="text-right text-slate-300 font-semibold py-3 px-4">Shares</th>
                  <th className="text-right text-slate-300 font-semibold py-3 px-4">Avg Price</th>
                  <th className="text-right text-slate-300 font-semibold py-3 px-4">Current Price</th>
                  <th className="text-right text-slate-300 font-semibold py-3 px-4">Total Value</th>
                  <th className="text-right text-slate-300 font-semibold py-3 px-4">Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="text-white font-semibold text-lg">{holding.symbol}</div>
                    </td>
                    <td className="text-right py-4 px-4 text-white">{holding.shares}</td>
                    <td className="text-right py-4 px-4 text-slate-300">${holding.averagePrice.toFixed(2)}</td>
                    <td className="text-right py-4 px-4 text-white font-semibold">${holding.currentPrice.toFixed(2)}</td>
                    <td className="text-right py-4 px-4 text-white font-semibold">${holding.totalValue.toFixed(2)}</td>
                    <td className="text-right py-4 px-4">
                      <div className={`font-semibold ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.abs(holding.gainLoss).toFixed(2)}
                      </div>
                      <div className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowTradeModal(false)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-6">Execute Trade</h3>

            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    tradeType === 'BUY' ? 'bg-green-600 text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    tradeType === 'SELL' ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  Sell
                </button>
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">Symbol</label>
                <input
                  type="text"
                  value={tradeSymbol}
                  onChange={(e) => setTradeSymbol(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">Shares</label>
                <input
                  type="number"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTrade}
                  className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-colors ${
                    tradeType === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {tradeType === 'BUY' ? 'Buy' : 'Sell'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
