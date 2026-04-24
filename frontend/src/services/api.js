import axios from 'axios'
import io from 'socket.io-client'

const API_BASE = '/api'
let socket = null

export const initSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    socket.on('connect', () => {
      console.log('✓ Socket connected')
    })

    socket.on('disconnect', () => {
      console.log('✗ Socket disconnected')
    })
  }
  return socket
}

export const getSocket = () => socket

// Graph APIs
export const graphAPI = {
  create: (data) => axios.post(`${API_BASE}/graphs`, data),
  getAll: (page = 1, limit = 10) => axios.get(`${API_BASE}/graphs`, { params: { page, limit } }),
  getById: (id) => axios.get(`${API_BASE}/graphs/${id}`),
  update: (id, data) => axios.put(`${API_BASE}/graphs/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/graphs/${id}`),
  refreshStats: (id) => axios.post(`${API_BASE}/graphs/${id}/refresh-stats`)
}

// Node APIs
export const nodeAPI = {
  create: (data) => axios.post(`${API_BASE}/nodes`, data),
  getByGraph: (graphId, page = 1, limit = 50) => 
    axios.get(`${API_BASE}/nodes`, { params: { graphId, page, limit } }),
  getById: (id) => axios.get(`${API_BASE}/nodes/${id}`),
  update: (id, data) => axios.put(`${API_BASE}/nodes/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/nodes/${id}`),
  getAncestors: (id) => axios.get(`${API_BASE}/nodes/${id}/ancestors`),
  getDescendants: (id) => axios.get(`${API_BASE}/nodes/${id}/descendants`),
  getSiblings: (id) => axios.get(`${API_BASE}/nodes/${id}/siblings`)
}

// Edge APIs
export const edgeAPI = {
  create: (data) => axios.post(`${API_BASE}/edges`, data),
  getByGraph: (graphId, page = 1, limit = 50) => 
    axios.get(`${API_BASE}/edges`, { params: { graphId, page, limit } }),
  getById: (id) => axios.get(`${API_BASE}/edges/${id}`),
  delete: (id) => axios.delete(`${API_BASE}/edges/${id}`),
  getIncoming: (nodeId) => axios.get(`${API_BASE}/edges/incoming/${nodeId}`),
  getOutgoing: (nodeId) => axios.get(`${API_BASE}/edges/outgoing/${nodeId}`),
  updateWeight: (id, weight) => axios.patch(`${API_BASE}/edges/${id}/weight`, { weight })
}

// Analytics APIs
export const analyticsAPI = {
  getGraphStats: (graphId) => axios.get(`${API_BASE}/analytics/graph/${graphId}`),
  getNodeMetrics: (graphId) => axios.get(`${API_BASE}/analytics/metrics/${graphId}`),
  getDepthDistribution: (graphId) => axios.get(`${API_BASE}/analytics/depth/${graphId}`),
  getNodeStats: (nodeId) => axios.get(`${API_BASE}/analytics/node/${nodeId}`),
  dfs: (graphId, startNodeId, direction = 'down') => 
    axios.get(`${API_BASE}/analytics/traverse/dfs/${graphId}/${startNodeId}`, { params: { direction } }),
  bfs: (graphId, startNodeId, direction = 'down') => 
    axios.get(`${API_BASE}/analytics/traverse/bfs/${graphId}/${startNodeId}`, { params: { direction } }),
  findAllPaths: (startNodeId, endNodeId) => 
    axios.get(`${API_BASE}/analytics/paths/all/${startNodeId}/${endNodeId}`),
  findShortestPath: (startNodeId, endNodeId) => 
    axios.get(`${API_BASE}/analytics/paths/shortest/${startNodeId}/${endNodeId}`),
  getSubtree: (nodeId, depth = -1) => 
    axios.get(`${API_BASE}/analytics/subtree/${nodeId}`, { params: { depth } }),
  getNodesByLevel: (graphId, level) => 
    axios.get(`${API_BASE}/analytics/level/${graphId}/${level}`),
  getLeafNodes: (graphId) => axios.get(`${API_BASE}/analytics/leaves/${graphId}`),
  getRootNodes: (graphId) => axios.get(`${API_BASE}/analytics/roots/${graphId}`),
  export: (graphId) => axios.get(`${API_BASE}/analytics/export/${graphId}`)
}
