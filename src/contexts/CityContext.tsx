'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type City = {
    id: string
    name: string
    slug: string
}

// MVP: Hardcoded London for now, but ready for API data
const DEFAULT_CITY: City = {
    id: 'london-uuid-placeholder', // Will come from DB later
    name: 'London',
    slug: 'london',
}

interface CityContextType {
    currentCity: City
    setCity: (city: City) => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: ReactNode }) {
    const [currentCity, setCity] = useState<City>(DEFAULT_CITY)

    return (
        <CityContext.Provider value={{ currentCity, setCity }}>
            {children}
        </CityContext.Provider>
    )
}

export function useCity() {
    const context = useContext(CityContext)
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider')
    }
    return context
}
