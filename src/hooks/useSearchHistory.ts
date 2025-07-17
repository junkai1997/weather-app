import { useState, useEffect } from 'react'

export interface SearchHistoryItem {
  id: string
  city: string
  timestamp: number
}

const STORAGE_KEY = 'weather-search-history'
const MAX_HISTORY_ITEMS = 10

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])

  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY)
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory)
        setSearchHistory(parsedHistory)
      } catch (error) {
        console.error('Error parsing search history:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory))
  }, [searchHistory])

  const addToHistory = (city: string) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      city: city.trim(),
      timestamp: Date.now()
    }

    setSearchHistory(prev => {
      // Remove existing entry for the same city (case-insensitive)
      const filtered = prev.filter(
        item => item.city.toLowerCase() !== city.toLowerCase()
      )
      
      // Add new item to the beginning and limit to MAX_HISTORY_ITEMS
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      
      return updated
    })
  }

  const removeFromHistory = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  }
}
