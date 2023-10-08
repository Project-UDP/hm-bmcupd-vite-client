import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Patient } from '../../types/Patient'

const PATIENT_BASE_URL = 'https://localhost:8080/api/v1/'

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: fetchBaseQuery({ baseUrl: PATIENT_BASE_URL }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Patient[], string>({
      query: (name) => `patinet/${name}`
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi
