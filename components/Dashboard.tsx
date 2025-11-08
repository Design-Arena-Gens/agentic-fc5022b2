'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { generateMockStockData, generateHistoricalData } from '@/lib/stockData'
import { StockData, HistoricalData } from '@/lib/types'

interface DashboardProps {
  selectedStock: string | null
}

export default function Dashboard({ selectedStock }: DashboardProps) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y')

  useEffect(() => {
    if (selectedStock) {
      const data = generateMockStockData(selectedStock)
      setStockData(data)

      const days = timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : timeRange === '6M' ? 180 : 365
      const historical = generateHistoricalData(selectedStock, days)
      setHistoricalData(historical)
    }
  }, [selectedStock, timeRange])

  if (!selectedStock || !stockData) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-white mb-2">Select a Stock to Get Started</h3>
        <p className="text-slate-300">Search for a stock symbol above to view detailed analysis</p>
      </div>
    )
  }

  const chartData = historicalData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: d.close,
  }))

  return (
    <div className="space-y-6">
      {/* Stock Info Card */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{stockData.symbol}</h2>
            <p className="text-slate-300">{stockData.name}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">${stockData.price.toFixed(2)}</div>
            <div className={`text-lg font-semibold ${stockData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stockData.change >= 0 ? '↑' : '↓'} ${Math.abs(stockData.change).toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Open" value={`$${stockData.open.toFixed(2)}`} />
          <StatCard label="High" value={`$${stockData.high.toFixed(2)}`} />
          <StatCard label="Low" value={`$${stockData.low.toFixed(2)}`} />
          <StatCard label="Volume" value={formatVolume(stockData.volume)} />
          <StatCard label="Prev Close" value={`$${stockData.previousClose.toFixed(2)}`} />
          <StatCard label="Market Cap" value={formatMarketCap(stockData.marketCap)} />
        </div>
      </div>

      {/* Chart */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Price History</h3>
          <div className="flex gap-2">
            {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="price" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="text-slate-400 text-sm mb-1">{label}</div>
      <div className="text-white font-semibold text-lg">{value}</div>
    </div>
  )
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
  return volume.toString()
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1000000000000) return `$${(marketCap / 1000000000000).toFixed(2)}T`
  if (marketCap >= 1000000000) return `$${(marketCap / 1000000000).toFixed(2)}B`
  if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(2)}M`
  return `$${marketCap.toFixed(0)}`
}
