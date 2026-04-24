import React, { useState, useCallback } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { graphAPI } from '../services/api'
import { useGraphStore } from '../store'
import { Modal, FormInput, FormTextarea, Button, Alert } from './Common'

export const GraphManagement = ({ onSelectGraph }) => {
  const { graphs, addGraph, removeGraph, updateGraph } = useGraphStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGraph, setEditingGraph] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', type: 'directed' })
  const [error, setError] = useState('')

  const handleCreate = useCallback(async () => {
    if (!formData.name.trim()) {
      setError('Graph name is required')
      return
    }

    try {
      const res = await graphAPI.create(formData)
      addGraph(res.data)
      setFormData({ name: '', description: '', type: 'directed' })
      setIsModalOpen(false)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create graph')
    }
  }, [formData, addGraph])

  const handleDelete = useCallback(async (graphId) => {
    if (window.confirm('Delete this graph?')) {
      try {
        await graphAPI.delete(graphId)
        removeGraph(graphId)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete graph')
      }
    }
  }, [removeGraph])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Graphs</h2>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={Plus}>
          New Graph
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid gap-4">
        {graphs.map(graph => (
          <div key={graph._id} className="card flex justify-between items-center hover:shadow-md transition-shadow">
            <div className="flex-1 cursor-pointer" onClick={() => onSelectGraph(graph)}>
              <h3 className="font-semibold text-lg">{graph.name}</h3>
              <p className="text-gray-600 text-sm">{graph.description || 'No description'}</p>
              <div className="text-xs text-gray-500 mt-2">
                Nodes: {graph.stats.nodeCount} | Edges: {graph.stats.edgeCount}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDelete(graph._id)} variant="danger" icon={Trash2} />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Create New Graph"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreate} variant="primary">
              Create
            </Button>
          </>
        }
      >
        <FormInput
          label="Graph Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Organization Chart"
        />
        <FormTextarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />
        <div className="form-group">
          <label className="form-label">Graph Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-select"
          >
            <option value="directed">Directed</option>
            <option value="undirected">Undirected</option>
          </select>
        </div>
      </Modal>
    </div>
  )
}
