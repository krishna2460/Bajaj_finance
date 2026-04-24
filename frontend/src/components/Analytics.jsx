import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const NodeMetricsChart = ({ metrics }) => {
  const topNodes = metrics?.slice(0, 10) || []

  return (
    <div className="card">
      <h3 className="card-header">Top 10 Nodes by Degree</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topNodes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inDegree" fill="#1f77b4" name="In-degree" />
          <Bar dataKey="outDegree" fill="#ff7f0e" name="Out-degree" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const DepthDistributionChart = ({ distribution }) => {
  return (
    <div className="card">
      <h3 className="card-header">Node Distribution by Depth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={distribution || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="depth" label={{ value: 'Depth Level', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Node Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="count" fill="#2ca02c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const StatCard = ({ label, value, icon: Icon }) => (
  <div className="stat-card">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={20} />}
      <span className="stat-label">{label}</span>
    </div>
    <div className="stat-value">{value}</div>
  </div>
)
