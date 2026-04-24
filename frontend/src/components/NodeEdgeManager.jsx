import React, { useState, useCallback, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { nodeAPI, edgeAPI, analyticsAPI } from '../services/api'
import { useNodeStore, useEdgeStore } from '../store'
import { Modal, FormInput, Button, Alert } from './Common'

export const NodeEdgeManager = ({ graphId, onNodeCreated, onEdgeCreated }) => {
  const { nodes, addNode, removeNode } = useNodeStore()
  const { edges, addEdge, removeEdge } = useEdgeStore()
  
  const [showNodeModal, setShowNodeModal] = useState(false)
  const [showEdgeModal, setShowEdgeModal] = useState(false)
  const [nodeForm, setNodeForm] = useState({ externalId: '', label: '' })
  const [edgeForm, setEdgeForm] = useState({ sourceId: '', targetId: '', weight: '1' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (graphId) {
      loadNodes()
      loadEdges()
    }
  }, [graphId])

  const loadNodes = useCallback(async () => {
    try {
      const res = await nodeAPI.getByGraph(graphId, 1, 1000)
      useNodeStore.setState({ nodes: res.data.nodes })
    } catch (err) {
      console.error('Failed to load nodes:', err)
    }
  }, [graphId])

  const loadEdges = useCallback(async () => {
    try {
      const res = await edgeAPI.getByGraph(graphId, 1, 1000)
      useEdgeStore.setState({ edges: res.data.edges })
    } catch (err) {
      console.error('Failed to load edges:', err)
    }
  }, [graphId])

  const handleCreateNode = useCallback(async () => {
    if (!nodeForm.externalId.trim() || !nodeForm.label.trim()) {
      setError('External ID and Label are required')
      return
    }

    try {
      const res = await nodeAPI.create({
        graphId,
        ...nodeForm
      })
      addNode(res.data)
      setNodeForm({ externalId: '', label: '' })
      setShowNodeModal(false)
      setSuccess('Node created successfully')
      onNodeCreated?.()
      
      // Refresh stats
      await analyticsAPI.getGraphStats(graphId)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create node')
    }
  }, [graphId, nodeForm, addNode, onNodeCreated])

  const handleCreateEdge = useCallback(async () => {
    if (!edgeForm.sourceId || !edgeForm.targetId) {
      setError('Source and target nodes are required')
      return
    }

    try {
      const res = await edgeAPI.create({
        graphId,
        sourceId: edgeForm.sourceId,
        targetId: edgeForm.targetId,
        weight: parseInt(edgeForm.weight)
      })
      addEdge(res.data)
      setEdgeForm({ sourceId: '', targetId: '', weight: '1' })
      setShowEdgeModal(false)
      setSuccess('Edge created successfully')
      onEdgeCreated?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create edge')
    }
  }, [graphId, edgeForm, addEdge, onEdgeCreated])

  const handleDeleteNode = useCallback(async (nodeId) => {
    if (window.confirm('Delete this node?')) {
      try {
        await nodeAPI.delete(nodeId)
        removeNode(nodeId)
        setSuccess('Node deleted successfully')
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete node')
      }
    }
  }, [removeNode])

  const handleDeleteEdge = useCallback(async (edgeId) => {
    if (window.confirm('Delete this edge?')) {
      try {
        await edgeAPI.delete(edgeId)
        removeEdge(edgeId)
        setSuccess('Edge deleted successfully')
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete edge')
      }
    }
  }, [removeEdge])

  return (
    <div className="space-y-6">
      {/* Nodes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Nodes ({nodes.length})</h3>
          <Button onClick={() => setShowNodeModal(true)} variant="primary" icon={Plus}>
            Add Node
          </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="grid gap-2 max-h-48 overflow-y-auto">
          {nodes.map(node => (
            <div key={node._id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
              <div>
                <p className="font-medium">{node.label}</p>
                <p className="text-xs text-gray-600">{node.externalId}</p>
              </div>
              <Button onClick={() => handleDeleteNode(node._id)} variant="danger" icon={Trash2} />
            </div>
          ))}
        </div>
      </div>

      {/* Edges Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edges ({edges.length})</h3>
          <Button onClick={() => setShowEdgeModal(true)} variant="primary" icon={Plus}>
            Add Edge
          </Button>
        </div>

        <div className="grid gap-2 max-h-48 overflow-y-auto">
          {edges.map(edge => (
            <div key={edge._id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
              <div>
                <p className="font-medium text-sm">{edge.source?.label} → {edge.target?.label}</p>
                <p className="text-xs text-gray-600">Weight: {edge.weight}</p>
              </div>
              <Button onClick={() => handleDeleteEdge(edge._id)} variant="danger" icon={Trash2} />
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showNodeModal}
        title="Add Node"
        onClose={() => setShowNodeModal(false)}
        footer={
          <>
            <Button onClick={() => setShowNodeModal(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleCreateNode} variant="primary">Create</Button>
          </>
        }
      >
        <FormInput
          label="External ID"
          value={nodeForm.externalId}
          onChange={(e) => setNodeForm({ ...nodeForm, externalId: e.target.value })}
          placeholder="Unique identifier"
        />
        <FormInput
          label="Label"
          value={nodeForm.label}
          onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
          placeholder="Display name"
        />
      </Modal>

      <Modal
        isOpen={showEdgeModal}
        title="Add Edge"
        onClose={() => setShowEdgeModal(false)}
        footer={
          <>
            <Button onClick={() => setShowEdgeModal(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleCreateEdge} variant="primary">Create</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Source Node</label>
          <select
            value={edgeForm.sourceId}
            onChange={(e) => setEdgeForm({ ...edgeForm, sourceId: e.target.value })}
            className="form-select"
          >
            <option value="">Select source...</option>
            {nodes.map(n => <option key={n._id} value={n._id}>{n.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Target Node</label>
          <select
            value={edgeForm.targetId}
            onChange={(e) => setEdgeForm({ ...edgeForm, targetId: e.target.value })}
            className="form-select"
          >
            <option value="">Select target...</option>
            {nodes.map(n => <option key={n._id} value={n._id}>{n.label}</option>)}
          </select>
        </div>
        <FormInput
          label="Weight"
          type="number"
          value={edgeForm.weight}
          onChange={(e) => setEdgeForm({ ...edgeForm, weight: e.target.value })}
        />
      </Modal>
    </div>
  )
}
