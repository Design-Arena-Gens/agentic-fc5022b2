'use client'

import { useState } from 'react'
import StockSearch from '@/components/StockSearch'
import Dashboard from '@/components/Dashboard'
import AIAnalysis from '@/components/AIAnalysis'
import Portfolio from '@/components/Portfolio'
import Backtesting from '@/components/Backtesting'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedStock, setSelectedStock] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">📈</span>
            AI Stock Trading Advisor
          </h1>
          <p className="text-slate-300">Intelligent market analysis, backtesting, and risk-assessed recommendations</p>
        </div>

        {/* Stock Search */}
        <div className="mb-6">
          <StockSearch onStockSelect={setSelectedStock} />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'analysis', label: 'AI Analysis', icon: '🤖' },
            { id: 'portfolio', label: 'Portfolio', icon: '💼' },
            { id: 'backtest', label: 'Backtesting', icon: '⏮️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && <Dashboard selectedStock={selectedStock} />}
          {activeTab === 'analysis' && <AIAnalysis selectedStock={selectedStock} />}
          {activeTab === 'portfolio' && <Portfolio />}
          {activeTab === 'backtest' && <Backtesting selectedStock={selectedStock} />}
        </div>
      </div>
    </main>
  )
}
