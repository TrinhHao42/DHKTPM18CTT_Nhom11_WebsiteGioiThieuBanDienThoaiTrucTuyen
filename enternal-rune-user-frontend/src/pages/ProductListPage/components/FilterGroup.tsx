/**
 * FilterGroup.tsx
 * Reusable filter group with checkboxes or radio buttons
 */

"use client"

import React, { useState } from 'react'

export interface FilterOption {
  value: string | number
  label: string
  type: 'checkbox' | 'radio'
  count?: number
}

interface FilterGroupProps {
  title: string
  options: FilterOption[]
  selectedValues: (string | number)[]
  onChange: (value: string | number, checked: boolean) => void
  collapsible?: boolean
}

export default function FilterGroup({
  title,
  options,
  selectedValues,
  onChange,
  collapsible = false
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {/* Header */}
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {collapsible && (
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Options */}
      {isOpen && (
        <div className="space-y-2">
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value)
            const inputId = `filter-${title}-${option.value}`

            return (
              <label
                key={option.value}
                htmlFor={inputId}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type={option.type}
                  id={inputId}
                  checked={isChecked}
                  onChange={(e) => onChange(option.value, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  aria-label={option.label}
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors flex-1">
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-400">({option.count})</span>
                )}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
