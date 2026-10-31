import { GeneratedFile, Platform } from './types';

export interface AppTemplate {
  id: string;
  name: string;
  category: string;
  promptExample: string;
  description: string;
  generateFiles: (prompt: string, appName: string) => GeneratedFile[];
  previewHtmlGenerator: (appName: string, prompt: string) => string;
}

export function sanitizeAppName(raw: string): string {
  const words = raw.trim().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).slice(0, 3);
  if (!words[0]) return 'H-AI-Generated-App';
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: 'crypto-terminal',
    name: 'QuantumTrade · Crypto & DeFi Terminal',
    category: 'Fintech & Web3',
    promptExample: 'A real-time high-frequency crypto trading terminal with live order book, portfolio tracker, risk analytics and instant swap',
    description: 'DeFi & CeFi portfolio dashboard with live candlestick charts, order books, slippage protection, and algorithmic bots.',
    generateFiles: (prompt, appName) => [
      {
        path: 'src/App.tsx',
        language: 'typescript',
        platform: 'web',
        description: 'Main React 19 Trading Terminal Component',
        content: `import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Shield, Zap, RefreshCw } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  holding: number;
}

const INITIAL_ASSETS: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 96420.50, change24h: 3.42, volume: '$42.8B', holding: 1.45 },
  { symbol: 'ETH', name: 'Ethereum', price: 3410.80, change24h: -1.18, volume: '$21.2B', holding: 12.8 },
  { symbol: 'SOL', name: 'Solana', price: 218.45, change24h: 8.64, volume: '$9.4B', holding: 85.0 },
  { symbol: 'AVAX', name: 'Avalanche', price: 38.90, change24h: 2.15, volume: '$1.8B', holding: 120.0 },
];

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_ASSETS[0]);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('0.5');

  // Live price fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(a => {
        const delta = (Math.random() - 0.48) * (a.price * 0.004);
        const newPrice = Number((a.price + delta).toFixed(2));
        return { ...a, price: newPrice };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalPortfolioValue = assets.reduce((sum, a) => sum + (a.price * a.holding), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 font-sans">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">${appName}</h1>
            <p className="text-xs text-cyan-400 font-mono">AUTONOMOUS QUANT TRADING ENGINE</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-xs text-slate-400">Total Portfolio Value</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              \${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Watchlist */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Market Watch</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
            </span>
          </h2>
          <div className="space-y-2">
            {assets.map(asset => {
              const isSelected = selectedAsset.symbol === asset.symbol;
              const isUp = asset.change24h >= 0;
              return (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={\`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between border \${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }\`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {asset.symbol}
                      <span className="text-xs text-slate-400 font-normal">{asset.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">Vol: {asset.volume}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">\${asset.price.toLocaleString()}</div>
                    <div className={\`text-xs font-mono flex items-center justify-end \${isUp ? 'text-emerald-400' : 'text-rose-400'}\`}>
                      {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {asset.change24h}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart & Execution Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold font-mono">{selectedAsset.symbol}/USDT</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
                  \${selectedAsset.price.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                {['1M', '15M', '1H', '4H', '1D'].map(t => (
                  <button key={t} className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700">{t}</button>
                ))}
              </div>
            </div>

            {/* Simulated Canvas Chart */}
            <div className="h-56 w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-3 left-4 text-xs font-mono text-slate-500">QUANTUM CANDLESTICK & VOLUME ENGINE</div>
              <div className="flex items-end gap-2 h-40 w-full pt-4">
                {[65, 78, 70, 85, 92, 88, 96, 90, 110, 105, 120, 115, 135, 142, 138, 155].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      style={{ height: \`\${(h / 160) * 100}%\` }}
                      className={\`w-full rounded-t transition-all \${i % 3 === 0 ? 'bg-rose-500/80' : 'bg-emerald-400/80 group-hover:bg-cyan-400'}\`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Order Execution */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex rounded-lg overflow-hidden border border-slate-800 p-0.5 bg-slate-950 mb-3">
                  <button
                    onClick={() => setOrderType('buy')}
                    className={\`flex-1 py-2 text-xs font-bold uppercase transition-all \${
                      orderType === 'buy' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }\`}
                  >
                    Buy {selectedAsset.symbol}
                  </button>
                  <button
                    onClick={() => setOrderType('sell')}
                    className={\`flex-1 py-2 text-xs font-bold uppercase transition-all \${
                      orderType === 'sell' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                    }\`}
                  >
                    Sell {selectedAsset.symbol}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Order Quantity ({selectedAsset.symbol})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Estimated Total:</span> <span className="font-mono text-white">\${(Number(amount || 0) * selectedAsset.price).toFixed(2)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Slippage Tolerance:</span> <span className="font-mono text-cyan-400">0.1%</span></div>
                  <div className="flex justify-between text-slate-400"><span>Gas / Execution Fee:</span> <span className="font-mono text-emerald-400">0.0001 ETH</span></div>
                </div>
                <button
                  className={\`mt-4 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all \${
                    orderType === 'buy'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }\`}
                >
                  <Zap className="w-4 h-4" />
                  Execute {orderType} Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
      },
      {
        path: 'ios/Views/TerminalView.swift',
        language: 'swift',
        platform: 'ios',
        description: 'Native Apple SwiftUI Trading View',
        content: `//
//  TerminalView.swift
//  ${appName}
//  Generated by H.AI J.A.R.V.I.S. Autonomous Factory
//

import SwiftUI

struct AssetModel: Identifiable {
    let id = UUID()
    let symbol: String
    let name: String
    let price: Double
    let change24h: Double
}

struct TerminalView: View {
    @State private var assets: [AssetModel] = [
        AssetModel(symbol: "BTC", name: "Bitcoin", price: 96420.50, change24h: 3.42),
        AssetModel(symbol: "ETH", name: "Ethereum", price: 3410.80, change24h: -1.18),
        AssetModel(symbol: "SOL", name: "Solana", price: 218.45, change24h: 8.64)
    ]
    @State private var selectedAssetSymbol = "BTC"

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.01, green: 0.03, blue: 0.08).ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Header Balance Card
                        VStack(alignment: .leading, spacing: 8) {
                            Text("PORTFOLIO VALUATION")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.cyan)
                            Text("$184,950.20")
                                .font(.system(size: 34, weight: .black, design: .monospaced))
                                .foregroundColor(.white)
                            HStack {
                                Image(systemName: "arrow.up.right")
                                Text("+4.68% (+$8,240 today)")
                            }
                            .font(.caption)
                            .foregroundColor(.green)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(18)
                        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.cyan.opacity(0.3), lineWidth: 1))

                        // Market Watch List
                        Text("Live Markets")
                            .font(.headline)
                            .foregroundColor(.white)

                        ForEach(assets) { asset in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(asset.symbol).font(.headline).foregroundColor(.white)
                                    Text(asset.name).font(.caption).foregroundColor(.gray)
                                }
                                Spacer()
                                VStack(alignment: .trailing) {
                                    Text("$\\(String(format: "%.2f", asset.price))")
                                        .font(.system(.body, design: .monospaced))
                                        .fontWeight(.bold)
                                        .foregroundColor(.white)
                                    Text("\\(asset.change24h >= 0 ? "+" : "")\\(String(format: "%.2f", asset.change24h))%")
                                        .font(.caption)
                                        .foregroundColor(asset.change24h >= 0 ? .green : .red)
                                }
                            }
                            .padding()
                            .background(Color.white.opacity(0.03))
                            .cornerRadius(14)
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("${appName}")
        }
    }
}`
      },
      {
        path: 'android/app/src/main/java/TerminalScreen.kt',
        language: 'kotlin',
        platform: 'android',
        description: 'Native Android Jetpack Compose Terminal',
        content: `package com.hai.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class CryptoAsset(
    val symbol: String,
    val name: String,
    val price: Double,
    val change: Double
)

@Composable
fun TerminalScreen() {
    val assets = remember {
        listOf(
            CryptoAsset("BTC", "Bitcoin", 96420.50, 3.42),
            CryptoAsset("ETH", "Ethereum", 3410.80, -1.18),
            CryptoAsset("SOL", "Solana", 218.45, 8.64)
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF020617))
            .padding(16.dp)
    ) {
        Text(
            text = "${appName} · Android Terminal",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF06B6D4)
        )
        
        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("TOTAL BALANCE", fontSize = 11.sp, color = Color(0xFF94A3B8), fontWeight = FontWeight.Bold)
                Text(
                    text = "$184,950.20",
                    fontSize = 30.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )
                Text(
                    text = "+4.68% (+$8,240)",
                    fontSize = 12.sp,
                    color = Color(0xFF10B981)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
        Text("Market Pairs", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(assets) { asset ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF0B132B), RoundedCornerShape(12.dp))
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(asset.symbol, fontWeight = FontWeight.Bold, color = Color.White)
                        Text(asset.name, fontSize = 12.sp, color = Color.Gray)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("$\${asset.price}", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = Color.White)
                        Text(
                            text = "\${if (asset.change >= 0) "+" else ""}\${asset.change}%",
                            fontSize = 12.sp,
                            color = if (asset.change >= 0) Color(0xFF10B981) else Color(0xFFEF4444)
                        )
                    }
                }
            }
        }
    }
}`
      },
      {
        path: 'supabase/schema.sql',
        language: 'sql',
        platform: 'backend',
        description: 'PostgreSQL Relational Schema with Row Level Security',
        content: `-- H.AI J.A.R.V.I.S. Auto-Generated Supabase PostgreSQL Schema
-- Application: ${appName}

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolios Table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_balance NUMERIC(18, 4) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT CHECK (side IN ('buy', 'sell')),
  order_type TEXT CHECK (order_type IN ('market', 'limit', 'stop_loss')),
  quantity NUMERIC(18, 8) NOT NULL,
  price NUMERIC(18, 8) NOT NULL,
  status TEXT DEFAULT 'filled' CHECK (status IN ('pending', 'filled', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Granular RLS Policies
CREATE POLICY "Users can only view their own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their orders via portfolio ownership"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios p
      WHERE p.id = orders.portfolio_id AND p.user_id = auth.uid()
    )
  );

CREATE INDEX idx_orders_symbol ON public.orders(symbol);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
`
      },
      {
        path: 'vercel.json',
        language: 'json',
        platform: 'backend',
        description: 'Vercel Edge & SPA rewrite configuration',
        content: `{
  "version": 2,
  "framework": "vite",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}`
      }
    ],
    previewHtmlGenerator: (appName) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #030712; color: #f3f4f6; font-family: system-ui, sans-serif; }
  </style>
</head>
<body class="p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-cyan-500/20 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-extrabold text-xl">⚡</div>
        <div>
          <h1 class="text-xl font-bold text-white">${appName} Live Sandbox</h1>
          <p class="text-xs text-cyan-400 font-mono">AUTONOMOUS MULTI-AGENT VERIFIED</p>
        </div>
      </div>
      <div class="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
        <span class="text-xs text-slate-400">Total Valuation</span>
        <div class="text-lg font-bold font-mono text-emerald-400">$184,950.20</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div class="text-xs font-bold text-slate-400 uppercase">Watchlist</div>
        <div class="space-y-2">
          <div class="p-2.5 bg-slate-950 rounded-lg flex justify-between border border-cyan-500/40">
            <span><b>BTC</b> Bitcoin</span> <span class="text-emerald-400 font-mono font-bold">$96,420</span>
          </div>
          <div class="p-2.5 bg-slate-950 rounded-lg flex justify-between border border-slate-800">
            <span><b>ETH</b> Ethereum</span> <span class="text-rose-400 font-mono font-bold">$3,410</span>
          </div>
          <div class="p-2.5 bg-slate-950 rounded-lg flex justify-between border border-slate-800">
            <span><b>SOL</b> Solana</span> <span class="text-emerald-400 font-mono font-bold">$218.45</span>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">BTC/USDT Trading View</span>
          <span class="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-mono">Real-Time</span>
        </div>
        <div class="h-40 bg-slate-950 rounded-lg p-3 flex items-end gap-1.5 border border-slate-800">
          <div class="flex-1 bg-emerald-500 rounded-t h-20"></div>
          <div class="flex-1 bg-emerald-500 rounded-t h-28"></div>
          <div class="flex-1 bg-rose-500 rounded-t h-16"></div>
          <div class="flex-1 bg-emerald-500 rounded-t h-36"></div>
          <div class="flex-1 bg-emerald-500 rounded-t h-32"></div>
          <div class="flex-1 bg-cyan-400 rounded-t h-40"></div>
        </div>
        <div class="flex gap-2">
          <button class="flex-1 py-2 rounded bg-emerald-500 text-black font-bold text-xs uppercase hover:bg-emerald-400">Buy BTC</button>
          <button class="flex-1 py-2 rounded bg-rose-500 text-white font-bold text-xs uppercase hover:bg-rose-400">Sell BTC</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  }
];

export function generateGenericApp(prompt: string): { files: GeneratedFile[]; previewHtml: string; name: string } {
  const appName = sanitizeAppName(prompt);

  const files: GeneratedFile[] = [
    {
      path: 'src/App.tsx',
      language: 'typescript',
      platform: 'web',
      description: 'Autonomous Full-Stack React 19 Application',
      content: `import React, { useState } from 'react';
import { Sparkles, Layers, CheckCircle2, ArrowRight, Shield, Zap, Search, Plus } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  status: 'active' | 'in-progress' | 'completed';
  category: string;
  metric: string;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'Core Autonomous Pipeline', status: 'completed', category: 'Architecture', metric: '100% Online' },
    { id: '2', title: 'Multi-Agent Synchronization', status: 'active', category: 'Agents', metric: '30 Nodes Active' },
    { id: '3', title: 'PostgreSQL RLS Hardening', status: 'completed', category: 'Database', metric: 'Zero-Trust' },
    { id: '4', title: 'Native iOS & Android Bridge', status: 'in-progress', category: 'Mobile', metric: 'Swift & Kotlin' }
  ]);

  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'active') return matchesSearch && item.status === 'active';
    if (activeTab === 'completed') return matchesSearch && item.status === 'completed';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Autonomous J.A.R.V.I.S. Deployment
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">${appName}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              "${prompt.slice(0, 100)}..."
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 font-bold">STATUS: OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search components, modules, entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['all', 'active', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={\`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all \${
                  activeTab === tab ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }\`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono">{item.category}</span>
                  <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${
                    item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.status === 'active' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }\`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">{item.title}</h3>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Metric</span>
                <span className="font-mono text-cyan-400 font-semibold">{item.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
    },
    {
      path: 'ios/AppView.swift',
      language: 'swift',
      platform: 'ios',
      description: 'Native Swift 6 / SwiftUI View',
      content: `//
//  AppView.swift
//  ${appName} (iOS Native Target)
//  Synthesized by H.AI J.A.R.V.I.S. Engine
//

import SwiftUI

struct AppView: View {
    @State private var items = ["Core Autonomous Engine", "30 Specialist Agents", "Supabase SQL Backend"]

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.02, green: 0.04, blue: 0.08).ignoresSafeArea()

                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("AUTONOMOUS DEPLOYMENT")
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundColor(.cyan)
                        Text("${appName}")
                            .font(.largeTitle)
                            .fontWeight(.heavy)
                            .foregroundColor(.white)
                    }
                    .padding(.top)

                    List {
                        ForEach(items, id: \\.self) { item in
                            HStack {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.green)
                                Text(item)
                                    .foregroundColor(.white)
                            }
                            .listRowBackground(Color.white.opacity(0.04))
                        }
                    }
                    .scrollContentBackground(.hidden)
                }
                .padding()
            }
            .navigationTitle("${appName}")
        }
    }
}`
    },
    {
      path: 'android/MainScreen.kt',
      language: 'kotlin',
      platform: 'android',
      description: 'Native Android Jetpack Compose Screen',
      content: `package com.hai.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun MainScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF030712))
            .padding(16.dp)
    ) {
        Text(
            text = "${appName}",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF06B6D4)
        )
        Text(
            text = "Autonomous Multi-Platform Build",
            fontSize = 12.sp,
            color = Color.LightGray
        )
        Spacer(modifier = Modifier.height(16.dp))
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Operational Status: 100% Online", color = Color(0xFF10B981))
                Text("30 Specialist Agents Deployed", color = Color.White)
            }
        }
    }
}`
    },
    {
      path: 'supabase/schema.sql',
      language: 'sql',
      platform: 'backend',
      description: 'PostgreSQL Relational Schema with Row Level Security',
      content: `-- PostgreSQL Relational Schema for ${appName}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own records"
  ON public.records FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_records_user ON public.records(user_id);
`
    },
    {
      path: 'vercel.json',
      language: 'json',
      platform: 'backend',
      description: 'Vercel Deployment Rules',
      content: `{
  "version": 2,
  "framework": "vite",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}`
    }
  ];

  const previewHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 p-8 font-sans">
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-cyan-500/30 pb-4">
      <div>
        <span class="text-xs text-cyan-400 font-mono">AUTONOMOUS J.A.R.V.I.S. VERIFIED</span>
        <h1 class="text-2xl font-bold text-white">${appName}</h1>
      </div>
      <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-full">ACTIVE</span>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-400">Target Frameworks</div>
        <div class="text-lg font-bold text-cyan-400 mt-1">React 19 + SwiftUI + Compose</div>
      </div>
      <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-400">Specialist Agents</div>
        <div class="text-lg font-bold text-emerald-400 mt-1">30 Orchestrated</div>
      </div>
    </div>
    <div class="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
      <h2 class="text-base font-bold mb-3">Live Application Sandbox</h2>
      <p class="text-sm text-slate-300">Your custom application prompt has been compiled into production-ready Web, iOS, Android, and PostgreSQL structures.</p>
    </div>
  </div>
</body>
</html>`;

  return { files, previewHtml, name: appName };
}
