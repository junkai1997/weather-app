import cities from 'cities.json'
import * as countryList from 'country-list'

interface City {
  name: string
  country: string
  subcountry?: string
  geonameid?: number
}

export const validateLocation = (input: string): boolean => {
  const trimmedInput = input.trim().toLowerCase()
  
  if (!trimmedInput) {
    return false
  }

  // Check if it's a valid country (by name or code)
  const isValidCountry = countryList.getName(trimmedInput) !== undefined || 
                        countryList.getCode(trimmedInput) !== undefined ||
                        // Check by country code (case insensitive)
                        countryList.getName(trimmedInput.toUpperCase()) !== undefined

  // Check if it's a valid city
  const isValidCity = (cities as City[]).some((city: City) => 
    city.name.toLowerCase() === trimmedInput
  )

  return isValidCity || isValidCountry
}

export const getLocationSuggestions = (input: string, limit: number = 5): string[] => {
  if (!input.trim()) return []
  
  const trimmedInput = input.trim().toLowerCase()
  const suggestions: string[] = []
  
  // Get city suggestions
  const cityMatches = (cities as City[])
    .filter((city: City) => city.name.toLowerCase().startsWith(trimmedInput))
    .slice(0, limit)
    .map((city: City) => city.name)
  
  suggestions.push(...cityMatches)
  
  // Get country suggestions if we have space
  if (suggestions.length < limit) {
    const countryMatches = countryList.getNames()
      .filter((country: string) => country.toLowerCase().startsWith(trimmedInput))
      .slice(0, limit - suggestions.length)
    
    suggestions.push(...countryMatches)
  }
  
  return suggestions.slice(0, limit)
}
