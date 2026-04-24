import React, { useState } from 'react'
import { X } from 'lucide-react'

export const Modal = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && <div className="p-6 border-t bg-gray-50 rounded-b-lg flex gap-2 justify-end">
          {footer}
        </div>}
      </div>
    </div>
  )
}

export const FormInput = ({ label, type = 'text', value, onChange, placeholder, error }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-input ${error ? 'border-red-500' : ''}`}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
)

export const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="form-textarea"
    />
  </div>
)

export const FormSelect = ({ label, value, onChange, options }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <select value={value} onChange={onChange} className="form-select">
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

export const Button = ({ children, onClick, variant = 'primary', disabled = false, icon: Icon, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant} disabled:opacity-50 disabled:cursor-not-allowed`}
    {...props}
  >
    {Icon && <Icon size={18} />}
    {children}
  </button>
)

export const Alert = ({ type = 'error', message, onClose }) => {
  const bgColor = {
    error: 'bg-red-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100'
  }[type]

  const textColor = {
    error: 'text-red-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }[type]

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && <button onClick={onClose}><X size={18} /></button>}
    </div>
  )
}

export const Loader = () => <div className="loader" />
