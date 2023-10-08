import axios, { AxiosResponse } from 'axios'
import { User } from '../types/User'
import { axiosInstance } from '../configurations/axiosConfiguration'
import { PagedResponse } from '../types/PagedResponse'
import { Patient } from '../types/Patient'
import { FilterParameters } from '../types/FilterParameters'
import { localStorageUtil } from '../utils/localStorageUtils'
import { Appointment } from '../types/Appointment'

const BASE_URL = 'http://localhost:8080/api/v1'
const AUTH_URL = BASE_URL + '/auth'
const PATIENT_URL = '/patient'
const STATSTICS_URL = '/statistics'
const USER_URL = '/user'
const ADMIN_URL = '/admin'
const APPOINTMENT_URL = '/appointment'

interface AuthResponse {
  token: string
  user: User
}

interface PatientCountResponse {
  count: number
}

interface AgeCategoryResponse {
  count: number
  ageCategory: string
}

interface DominantHandCountsResponse {
  leftCount: number
  rightCount: number
}

interface GenderCountsResponse {
  maleCount: number
  femaleCount: number
}

interface IcdCountsResponse {
  count: number
  icd: string
}

interface NationalityCountsResponse {
  count: number
  nation: string
}

interface RegionCountsResponse {
  count: number
  region: string
}

interface MonthCountResponse {
  month: number
  count: number
}

export const api = {
  auth: {
    authenticate: async (
      username: string,
      password: string
    ): Promise<AxiosResponse<AuthResponse, any>> => {
      return await axios.post(AUTH_URL + '/authenticate', {
        username,
        password
      })
    }
  },

  user: {
    getAll: async (): Promise<AxiosResponse<User[]>> => {
      return await axiosInstance.get(`${USER_URL}/all`)
    },

    add: async (user: User): Promise<AxiosResponse<any, any>> => {
      return await axiosInstance.post(USER_URL, user)
    },

    remove: async (id: number): Promise<AxiosResponse<any, any>> => {
      return await axiosInstance.delete(`${USER_URL}/${id}`)
    }
  },

  patient: {
    getByIin: async (iin: string): Promise<AxiosResponse<Patient, any>> => {
      return await axiosInstance.get(`${PATIENT_URL}/iin/${iin}`)
    },

    getPagedFiltered: async (
      parameters: FilterParameters,
      pageNumber: number = 0,
      pageSize: number = 6
    ): Promise<AxiosResponse<PagedResponse<Patient>, any>> => {
      let params = JSON.parse(JSON.stringify(parameters))
      formatParameters(params)
      return await axiosInstance.get(PATIENT_URL, {
        params,
        headers: {
          'Page-Number': pageNumber,
          'Page-Size': pageSize
        }
      })
    },

    add: async (payload: Patient): Promise<AxiosResponse<Patient, any>> => {
      const patient = JSON.parse(JSON.stringify(payload)) //TODO: type it
      const user: User | null = localStorageUtil.user.get()
      patient.lastEditingUser = `${user?.secondname} ${user?.firstname} ${
        user?.patronymic || ''
      }`
      formatPatient(patient)
      return await axiosInstance.post(PATIENT_URL, patient)
    },

    edit: async (payload: Patient) => {
      const patient = JSON.parse(JSON.stringify(payload)) //TODO: type it
      const user: User | null = localStorageUtil.user.get()
      patient.lastEditingUser = `${user?.secondname} ${user?.firstname} ${
        user?.patronymic || ''
      }`
      formatPatient(patient)
      return await axiosInstance.put(PATIENT_URL, patient)
    }
  },

  statistics: {
    getPatientCount: async (): Promise<
      AxiosResponse<PatientCountResponse, any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/count`)
    },

    getAgeCategoryCounts: async (): Promise<
      AxiosResponse<AgeCategoryResponse[], any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/age`)
    },

    getDominantHandCounts: async (): Promise<
      AxiosResponse<DominantHandCountsResponse, any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/dominant-hand`)
    },

    getGenderCounts: async (): Promise<
      AxiosResponse<GenderCountsResponse, any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/gender`)
    },

    getIcdCounts: async (): Promise<
      AxiosResponse<IcdCountsResponse[], any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/icd`)
    },

    getNationalityCounts: async (): Promise<
      AxiosResponse<NationalityCountsResponse[], any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/nationality`)
    },

    getRegionCounts: async (): Promise<
      AxiosResponse<RegionCountsResponse[], any>
    > => {
      return await axiosInstance.get(`${STATSTICS_URL}/regions`)
    },

    getRegistrationRatesByYear: async (
      year: number
    ): Promise<AxiosResponse<MonthCountResponse[], any>> => {
      return await axiosInstance.get(`${STATSTICS_URL}/registration-rates`, {
        params: {
          year: year
        }
      })
    }
  },

  admin: {
    addUser: async (user: User): Promise<AxiosResponse<any, any>> => {
      return await axiosInstance.post(`${ADMIN_URL}/add-user`, user)
    },

    editUser: async (user: User): Promise<AxiosResponse<any, any>> => {
      return await axiosInstance.put(`${ADMIN_URL}/edit-user`, user)
    },

    removeUser: async (id: number): Promise<AxiosResponse<any, any>> => {
      return await axiosInstance.delete(`${ADMIN_URL}/remove-user/${id}`)
    }
  },

  appointment: {
    add: async (appointment: Appointment): Promise<AxiosResponse<any>> => {
      return await axiosInstance.post(APPOINTMENT_URL, appointment)
    },

    getByDoctor: async (
      doctorId: number
    ): Promise<AxiosResponse<Appointment[]>> => {
      return await axiosInstance.get(`${APPOINTMENT_URL}/${doctorId}`)
    },

    remove: async (id: number): Promise<AxiosResponse<string>> => {
      return await axiosInstance.delete(`${APPOINTMENT_URL}/${id}`)
    }
  }
}

const formatParameters = (parameters: FilterParameters) => {
  if (parameters.registrationDate) {
    parameters.registrationDateGt = (
      parameters.registrationDate[0] as unknown as string
    ).substring(0, 10)
    parameters.registrationDateLt = (
      parameters.registrationDate[1] as unknown as string
    ).substring(0, 10)
    delete parameters['registrationDate']
  }
  if (parameters.age) {
    const range = JSON.parse(parameters.age)
    console.log('range', range)
    parameters.ageFrom = range[0]
    parameters.ageTo = range[1]
    delete parameters['age']
  }
}

const formatPatient = (patient: any) => {
  for (const key in patient) {
    // stringifyes json fields
    if (
      typeof patient[key] === 'object' &&
      !Array.isArray(patient[key]) &&
      patient[key] !== null &&
      !(patient[key] instanceof Date)
    ) {
      patient[key] = JSON.stringify(patient[key])
    }
    // not chosen to null
    if (patient[key] === 'Выберите') {
      patient[key] = null
    }
  }
}
