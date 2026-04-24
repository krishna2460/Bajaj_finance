import { create } from 'zustand'

export const useGraphStore = create((set) => ({
  // Graph state
  graphs: [],
  currentGraph: null,
  selectedNode: null,
  selectedEdge: null,
  
  // UI state
  loading: false,
  error: null,
  successMessage: '',
  
  // Actions
  setGraphs: (graphs) => set({ graphs }),
  setCurrentGraph: (graph) => set({ currentGraph: graph }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge }),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: '' }),
  
  // Graph operations
  addGraph: (graph) => set((state) => ({ graphs: [graph, ...state.graphs] })),
  removeGraph: (graphId) => set((state) => ({
    graphs: state.graphs.filter(g => g._id !== graphId),
    currentGraph: state.currentGraph?._id === graphId ? null : state.currentGraph
  })),
  updateGraph: (graphId, updates) => set((state) => ({
    graphs: state.graphs.map(g => g._id === graphId ? { ...g, ...updates } : g),
    currentGraph: state.currentGraph?._id === graphId ? { ...state.currentGraph, ...updates } : state.currentGraph
  }))
}))

export const useNodeStore = create((set) => ({
  nodes: [],
  nodeCache: {},
  
  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((state) => ({ nodes: [node, ...state.nodes] })),
  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(n => n._id !== nodeId)
  })),
  updateNode: (nodeId, updates) => set((state) => ({
    nodes: state.nodes.map(n => n._id === nodeId ? { ...n, ...updates } : n)
  })),
  cacheNode: (nodeId, data) => set((state) => ({
    nodeCache: { ...state.nodeCache, [nodeId]: data }
  }))
}))

export const useEdgeStore = create((set) => ({
  edges: [],
  
  setEdges: (edges) => set({ edges }),
  addEdge: (edge) => set((state) => ({ edges: [edge, ...state.edges] })),
  removeEdge: (edgeId) => set((state) => ({
    edges: state.edges.filter(e => e._id !== edgeId)
  })),
  updateEdge: (edgeId, updates) => set((state) => ({
    edges: state.edges.map(e => e._id === edgeId ? { ...e, ...updates } : e)
  }))
}))

export const useAnalyticsStore = create((set) => ({
  stats: null,
  metrics: [],
  depthDistribution: [],
  
  setStats: (stats) => set({ stats }),
  setMetrics: (metrics) => set({ metrics }),
  setDepthDistribution: (distribution) => set({ depthDistribution: distribution })
}))
