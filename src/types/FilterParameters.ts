import { Dayjs } from 'dayjs'

export interface FilterParameters {
  registrationDate?: Dayjs[]
  registrationDateGt?: string
  registrationDateLt?: string
  isMale?: string
  isRightHanded?: string
  age?: string
  ageFrom?: string
  ageTo?: string
  epilepsyType?: string
  icd?: string
  fio?: string
}
