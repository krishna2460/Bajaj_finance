import React, { useState } from 'react'
import { AlertCircle, CheckCircle, Upload, Download, GitBranch } from 'lucide-react'
import axios from 'axios'

export function BFHLProcessor() {
  const [formData, setFormData] = useState({
    user_id: '',
    email_id: '',
    college_roll_number: '',
    edges: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const parseEdges = (input) => {
    // Handle various input formats
    try {
      if (input.trim().startsWith('[')) {
        return JSON.parse(input)
      }
    } catch (e) {
      // Continue
    }

    // Try comma-separated
    if (input.includes(',')) {
      return input.split(',').map(x => x.trim())
    }

    // Try one per line
    return input.split('\n').map(x => x.trim()).filter(x => x)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.user_id.trim() || !formData.email_id.trim() || !formData.college_roll_number.trim() || !formData.edges.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = parseEdges(formData.edges)
      
      if (data.length === 0) {
        setError('Please enter some edges')
        setLoading(false)
        return
      }

      const response = await axios.post('http://localhost:5000/bfhl', {
        user_id: formData.user_id,
        email_id: formData.email_id,
        college_roll_number: formData.college_roll_number,
        data
      })
      
      if (response.data.is_success) {
        setResult(response.data)
      } else {
        setError(response.data.message || 'API returned an error')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err.response?.data?.message || 'Failed to process data. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      user_id: '',
      email_id: '',
      college_roll_number: '',
      edges: ''
    })
    setResult(null)
    setError('')
  }

  const handleDownload = () => {
    if (!result) return
    const dataStr = JSON.stringify(result, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'bfhl-result.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-900">BFHL Hierarchies Processor</h1>
          </div>
          <p className="text-slate-600">Process graph edges and build hierarchical trees with cycle detection</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Input Data
              </h2>

              {/* User ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">User ID (format: fullname_ddmmyyyy)</label>
                <input
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  placeholder="e.g., johndoe_17091999"
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email ID</label>
                <input
                  type="email"
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleInputChange}
                  placeholder="e.g., john.doe@college.edu"
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">College Roll Number</label>
                <input
                  type="text"
                  name="college_roll_number"
                  value={formData.college_roll_number}
                  onChange={handleInputChange}
                  placeholder="e.g., 21CS1001"
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-semibold mb-1">Edge Format:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Format: <code className="bg-white px-1 rounded">A->B</code> (single uppercase letters)</li>
                  <li>Comma-separated: <code className="bg-white px-1 rounded">A->B, A->C, B->D</code></li>
                  <li>One per line</li>
                  <li>Invalid: numbers, multi-char, self-loops, empty</li>
                </ul>
              </div>

              {/* Edges Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Edges Data</label>
                <textarea
                  name="edges"
                  value={formData.edges}
                  onChange={handleInputChange}
                  placeholder={'Enter edges:\n\nA->B\nA->C\nB->D\nC->E'}
                  className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Error</p>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Process Data
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {result ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 max-h-full overflow-y-auto">
                <div className="p-6">
                  {/* User Info */}
                  <div className="bg-slate-100 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><p className="text-slate-600">User ID:</p><p className="font-semibold">{result.user_id}</p></div>
                      <div><p className="text-slate-600">Email:</p><p className="font-semibold">{result.email_id}</p></div>
                      <div><p className="text-slate-600">Roll Number:</p><p className="font-semibold">{result.college_roll_number}</p></div>
                    </div>
                  </div>

                  {/* Hierarchies */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-slate-900 mb-3">Hierarchies</h3>
                    <div className="space-y-3">
                      {result.hierarchies.map((hierarchy, idx) => (
                        <div key={idx} className="border border-slate-300 rounded-lg p-3 bg-slate-50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-indigo-600">Root: {hierarchy.root}</span>
                            {hierarchy.has_cycle && <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">CYCLE</span>}
                            {hierarchy.depth && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Depth: {hierarchy.depth}</span>}
                          </div>
                          {hierarchy.has_cycle ? (
                            <p className="text-sm text-red-600 italic">Cyclic structure detected</p>
                          ) : (
                            <pre className="text-xs bg-white border border-slate-200 rounded p-2 overflow-auto max-h-24">
                              {JSON.stringify(hierarchy.tree, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invalid & Duplicates */}
                  {(result.invalid_entries.length > 0 || result.duplicate_edges.length > 0) && (
                    <div className="mb-6 space-y-3">
                      {result.invalid_entries.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 mb-2">Invalid Entries ({result.invalid_entries.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.invalid_entries.map((entry, idx) => (
                              <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                {entry}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.duplicate_edges.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 mb-2">Duplicate Edges ({result.duplicate_edges.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.duplicate_edges.map((edge, idx) => (
                              <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                {edge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">Summary</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-slate-600">Trees</p>
                        <p className="text-2xl font-bold text-indigo-600">{result.summary.total_trees}</p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-slate-600">Cycles</p>
                        <p className="text-2xl font-bold text-red-600">{result.summary.total_cycles}</p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-slate-600">Largest</p>
                        <p className="text-2xl font-bold text-green-600">{result.summary.largest_tree_root || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Results (JSON)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GitBranch className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">Fill in all fields and click "Process Data"</p>
                  <p className="text-slate-500 text-sm mt-2">Your hierarchies will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
