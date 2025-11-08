'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { generateHistoricalData } from '@/lib/stockData'
import { runBacktest, strategies } from '@/lib/backtesting'
import { BacktestResult, Trade } from '@/lib/types'

interface BacktestingProps {
  selectedStock: string | null
}

export default function Backtesting({ selectedStock }: BacktestingProps) {
  const [selectedStrategy, setSelectedStrategy] = useState(0)
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(false)
  const [initialCapital, setInitialCapital] = useState('10000')

  const runTest = () => {
    if (!selectedStock) return

    setLoading(true)
    setTimeout(() => {
      const historicalData = generateHistoricalData(selectedStock, 365)
      const { result: backtestResult, trades: backtestTrades } = runBacktest(
        historicalData,
        strategies[selectedStrategy],
        parseFloat(initialCapital)
      )
      setResult(backtestResult)
      setTrades(backtestTrades)
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    if (selectedStock) {
      runTest()
    }
  }, [selectedStock])

  if (!selectedStock) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">⏮️</div>
        <h3 className="text-2xl font-bold text-white mb-2">Strategy Backtesting</h3>
        <p className="text-slate-300">Select a stock to backtest trading strategies with historical data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <div className="glass-effect rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Backtest Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Select Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {strategies.map((strategy, index) => (
                <option key={index} value={index} className="bg-slate-800">
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-2 block">Initial Capital ($)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Running Backtest...' : 'Run Backtest'}
        </button>
      </div>

      {loading && (
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="animate-pulse">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Running Backtest...</h3>
            <p className="text-slate-300">Analyzing historical data and simulating trades</p>
          </div>
        </div>
      )}

      {!loading && result && (
        <>
          {/* Results Summary */}
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Backtest Results</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                label="Initial Capital"
                value={`$${result.initialCapital.toLocaleString()}`}
                icon="💵"
              />
              <MetricCard
                label="Final Value"
                value={`$${result.finalValue.toLocaleString()}`}
                icon="💰"
                highlight={result.totalReturn >= 0 ? 'green' : 'red'}
              />
              <MetricCard
                label="Total Return"
                value={`${result.totalReturnPercent >= 0 ? '+' : ''}${result.totalReturnPercent.toFixed(2)}%`}
                icon="📈"
                highlight={result.totalReturnPercent >= 0 ? 'green' : 'red'}
              />
              <MetricCard
                label="Total Trades"
                value={result.trades.toString()}
                icon="🔄"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Win Rate"
                value={`${result.winRate.toFixed(1)}%`}
                icon="🎯"
              />
              <MetricCard
                label="Sharpe Ratio"
                value={result.sharpeRatio.toFixed(2)}
                icon="📊"
              />
              <MetricCard
                label="Max Drawdown"
                value={`${result.maxDrawdown.toFixed(2)}%`}
                icon="📉"
              />
              <MetricCard
                label="Avg Trade Return"
                value={`${result.avgTradeReturn >= 0 ? '+' : ''}${result.avgTradeReturn.toFixed(2)}%`}
                icon="💹"
              />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Trade History</h3>

            {trades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-slate-300 font-semibold py-3 px-4">Date</th>
                      <th className="text-left text-slate-300 font-semibold py-3 px-4">Action</th>
                      <th className="text-right text-slate-300 font-semibold py-3 px-4">Shares</th>
                      <th className="text-right text-slate-300 font-semibold py-3 px-4">Price</th>
                      <th className="text-right text-slate-300 font-semibold py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.slice(0, 20).map((trade, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-slate-300">{trade.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 text-white">{trade.shares}</td>
                        <td className="text-right py-3 px-4 text-white">${trade.price.toFixed(2)}</td>
                        <td className="text-right py-3 px-4 text-white font-semibold">${trade.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {trades.length > 20 && (
                  <div className="text-center mt-4 text-slate-400 text-sm">
                    Showing first 20 of {trades.length} trades
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-300">No trades executed with this strategy</p>
              </div>
            )}
          </div>

          {/* Strategy Info */}
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Strategy: {result.strategy}</h3>
            <p className="text-slate-300 mb-4">
              Backtested from {result.startDate} to {result.endDate}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="text-blue-400 font-semibold mb-1">About This Strategy</h4>
                  <p className="text-slate-300 text-sm">
                    {getStrategyDescription(result.strategy)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ label, value, icon, highlight }: {
  label: string
  value: string
  icon: string
  highlight?: 'green' | 'red'
}) {
  const colorClass = highlight === 'green' ? 'text-green-400' : highlight === 'red' ? 'text-red-400' : 'text-white'

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
    </div>
  )
}

function getStrategyDescription(strategyName: string): string {
  const descriptions: { [key: string]: string } = {
    'Moving Average Crossover': 'Generates buy signals when short-term moving average crosses above long-term, and sell signals on the opposite crossover.',
    'RSI Mean Reversion': 'Buys when RSI indicates oversold conditions (below 30) and sells when overbought (above 70).',
    'Momentum Strategy': 'Follows strong price trends by buying on positive momentum and selling on negative momentum.',
    'Breakout Strategy': 'Enters positions when price breaks above recent highs and exits on breakdowns below recent lows.',
  }
  return descriptions[strategyName] || 'Custom trading strategy based on technical indicators.'
}
