import React, { useState, useEffect } from 'react'
import { graphAPI, initSocket } from './services/api'
import { useGraphStore } from './store'
import './styles/index.css'
import { GraphManagement } from './components/GraphManagement'
import { GraphExplorer } from './components/GraphExplorer'
import { BFHLProcessor } from './components/BFHLProcessor'
import { AlertCircle, Network, BarChart3 } from 'lucide-react'

function App() {
  const [currentTab, setCurrentTab] = useState('graphs') // 'graphs' or 'bfhl'
  const [currentGraph, setCurrentGraph] = useState(null)
  const { setGraphs } = useGraphStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize
    initSocket()
    loadGraphs()
  }, [])

  const loadGraphs = async () => {
    try {
      const res = await graphAPI.getAll(1, 50)
      setGraphs(res.data.graphs)
    } catch (err) {
      console.error('Failed to load graphs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGraph = (graph) => {
    setCurrentGraph(graph)
  }

  const handleBackToList = () => {
    setCurrentGraph(null)
    loadGraphs()
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setCurrentGraph(null) // Clear any selected graph when switching tabs
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                🚀 Data Processing Suite
              </h1>
              <p className="text-slate-600 mt-1">Graph Explorer & BFHL Processor</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => handleTabChange('graphs')}
              className={`flex items-center gap-2 py-3 px-4 font-semibold transition-colors border-b-2 ${
                currentTab === 'graphs'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Network className="w-5 h-5" />
              Graph Explorer
            </button>
            <button
              onClick={() => handleTabChange('bfhl')}
              className={`flex items-center gap-2 py-3 px-4 font-semibold transition-colors border-b-2 ${
                currentTab === 'bfhl'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              BFHL Processor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentTab === 'graphs' ? (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="loader" />
              </div>
            ) : currentGraph ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <button
                      onClick={handleBackToList}
                      className="text-blue-600 hover:text-blue-800 font-medium mb-2"
                    >
                      ← Back to Graphs
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {currentGraph.name}
                    </h2>
                    <p className="text-slate-600">{currentGraph.description}</p>
                  </div>
                </div>
                <GraphExplorer graphId={currentGraph._id} />
              </>
            ) : (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
                  <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Welcome!</h3>
                    <p className="text-blue-800 text-sm">
                      Create or select a graph to start exploring hierarchical data structures. 
                      Visualize node relationships, analyze graph metrics, and traverse your data using graph algorithms.
                    </p>
                  </div>
                </div>
                <GraphManagement onSelectGraph={handleSelectGraph} />
              </div>
            )}
          </div>
        ) : (
          <BFHLProcessor />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-600 text-sm">
          <p>Data Processing Suite v1.0 | Graph Explorer + BFHL Processor | Powered by Node.js, React & MongoDB</p>
        </div>
      </footer>
    </div>
  )
}

export default App
