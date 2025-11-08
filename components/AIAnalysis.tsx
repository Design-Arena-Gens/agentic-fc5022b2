'use client'

import { useEffect, useState } from 'react'
import { generateMockStockData, generateHistoricalData } from '@/lib/stockData'
import { generateAIRecommendation } from '@/lib/aiEngine'
import { AIRecommendation } from '@/lib/types'

interface AIAnalysisProps {
  selectedStock: string | null
}

export default function AIAnalysis({ selectedStock }: AIAnalysisProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedStock) {
      setLoading(true)
      setTimeout(() => {
        const stockData = generateMockStockData(selectedStock)
        const historicalData = generateHistoricalData(selectedStock, 365)
        const rec = generateAIRecommendation(stockData, historicalData)
        setRecommendation(rec)
        setLoading(false)
      }, 1000)
    }
  }, [selectedStock])

  if (!selectedStock) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Analysis</h3>
        <p className="text-slate-300">Select a stock to get AI-generated recommendations and insights</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="animate-pulse">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-white mb-2">Analyzing {selectedStock}...</h3>
          <p className="text-slate-300">AI is processing market data, sentiment, and technical indicators</p>
        </div>
      </div>
    )
  }

  if (!recommendation) return null

  const actionColors = {
    BUY: 'bg-green-500',
    SELL: 'bg-red-500',
    HOLD: 'bg-yellow-500',
  }

  const riskColors = {
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-red-400',
  }

  return (
    <div className="space-y-6">
      {/* Main Recommendation Card */}
      <div className="glass-effect rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Recommendation</h2>
            <p className="text-slate-300">Based on technical, fundamental, and sentiment analysis</p>
          </div>
          <div className={`${actionColors[recommendation.action]} text-white px-8 py-4 rounded-xl text-3xl font-bold`}>
            {recommendation.action}
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">Confidence Level</span>
            <span className="text-white font-bold text-xl">{recommendation.confidence.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${recommendation.confidence}%` }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-slate-300">Risk Level:</span>
          <span className={`font-bold text-xl ${riskColors[recommendation.riskLevel]}`}>
            {recommendation.riskLevel}
          </span>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ScoreCard
            label="Technical Score"
            score={recommendation.technicalScore}
            icon="📈"
          />
          <ScoreCard
            label="Fundamental Score"
            score={recommendation.fundamentalScore}
            icon="💼"
          />
          <ScoreCard
            label="Sentiment Score"
            score={recommendation.sentiment}
            icon="💭"
          />
        </div>

        {/* Price Targets */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 text-sm mb-1">Target Price</div>
            <div className="text-white font-bold text-2xl">${recommendation.targetPrice.toFixed(2)}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="text-red-400 text-sm mb-1">Stop Loss</div>
            <div className="text-white font-bold text-2xl">${recommendation.stopLoss.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Reasoning Card */}
      <div className="glass-effect rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Analysis Details</h3>
        <div className="space-y-3">
          {recommendation.reasoning.map((reason, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
              <div className="text-purple-400 font-bold text-lg">{index + 1}</div>
              <p className="text-slate-200 flex-1">{reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h4 className="text-white font-semibold mb-1">Investment Disclaimer</h4>
            <p className="text-slate-300 text-sm">
              This AI-generated recommendation is for informational purposes only and should not be considered as financial advice.
              Always conduct your own research and consult with a qualified financial advisor before making investment decisions.
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ label, score, icon }: { label: string; score: number; icon: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
        {score.toFixed(1)}
      </div>
      <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
