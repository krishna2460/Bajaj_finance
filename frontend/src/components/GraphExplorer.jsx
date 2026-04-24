import React, { useState, useEffect } from 'react'
import { graphAPI, analyticsAPI, initSocket } from '../services/api'
import { useGraphStore, useAnalyticsStore } from '../store'
import { GraphVisualization } from './GraphVisualization'
import { NodeMetricsChart, DepthDistributionChart, StatCard } from './Analytics'
import { NodeEdgeManager } from './NodeEdgeManager'
import { Button, Alert } from './Common'
import { Activity, Network, Layers } from 'lucide-react'

export const GraphExplorer = ({ graphId }) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [stats, setStats] = useState(null)
  const [metrics, setMetrics] = useState([])
  const [distribution, setDistribution] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('visualization')

  useEffect(() => {
    if (graphId) {
      loadGraphData()
      const interval = setInterval(loadGraphData, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [graphId])

  const loadGraphData = async () => {
    try {
      setLoading(true)
      // Fetch nodes and edges
      const [nodesRes, edgesRes, statsRes, metricsRes, distRes] = await Promise.all([
        fetch(`/api/nodes?graphId=${graphId}`).then(r => r.json()),
        fetch(`/api/edges?graphId=${graphId}`).then(r => r.json()),
        analyticsAPI.getGraphStats(graphId),
        analyticsAPI.getNodeMetrics(graphId),
        analyticsAPI.getDepthDistribution(graphId)
      ])

      setNodes(nodesRes.nodes || [])
      setEdges(edgesRes.edges || [])
      setStats(statsRes.data)
      setMetrics(metricsRes.data)
      setDistribution(distRes.data)
    } catch (err) {
      setError('Failed to load graph data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = (node) => {
    setSelectedNodeId(node._id)
  }

  return (
    <div className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <StatCard
            label="Total Nodes"
            value={stats?.nodeCount || 0}
            icon={Network}
          />
        </div>
        <div className="card">
          <StatCard
            label="Total Edges"
            value={stats?.edgeCount || 0}
            icon={Activity}
          />
        </div>
        <div className="card">
          <StatCard
            label="Max Depth"
            value={stats?.maxDepth || 0}
            icon={Layers}
          />
        </div>
        <div className="card">
          <StatCard
            label="Avg Depth"
            value={stats?.avgDepth || 0}
            icon={Layers}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('visualization')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'visualization'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          Visualization
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'manage'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600'
          }`}
        >
          Manage
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'visualization' && (
        <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="loader" />
            </div>
          ) : (
            <GraphVisualization
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNodeId}
            />
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NodeMetricsChart metrics={metrics} />
          <DepthDistributionChart distribution={distribution} />
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="card">
          <NodeEdgeManager
            graphId={graphId}
            onNodeCreated={loadGraphData}
            onEdgeCreated={loadGraphData}
          />
        </div>
      )}
    </div>
  )
}
