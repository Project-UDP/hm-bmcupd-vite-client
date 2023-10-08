import { Multioption } from './Multioption'

export interface Patient {
  id: number

  // region Passport data
  isResident: boolean

  nationality?: string

  isMale?: boolean

  isRightHanded?: boolean

  registrationNumber: string

  firstName: string

  secondName: string

  patronymic?: string

  dateOfBirth: string

  iin: string

  birthRegion?: string

  birthAddress?: string

  livingRegion?: string

  livingAddress?: string

  phoneNumber?: string

  educationProfession?: string

  dispensaryRegistration?: string

  workStatus?: string

  familyStatus?: string

  isDriver?: boolean
  // end region

  // region Anamnesis vitae
  childCount?: number

  pregnancyFeatures?: Multioption | string

  childBirthFeatures?: Multioption | string

  afterBirthFeatures?: Multioption | string

  childEarlyDevelopment?: string
  // end region

  // region Анамнез эпилепсии
  isFS?: string

  neuroinfection?: string

  ageOfTheFirstAttack?: Multioption | string

  neonatalAndInfantAge?: Multioption | string | null

  childrenAndYouth?: Multioption | string

  adultAndElderly?: Multioption | string

  actualSituationAdultAndElderly?: Multioption | string

  epilepsyType?: string

  icd?: string

  featuresOfSeizures?: Multioption | string

  withMotorSymptoms?: Multioption | string

  noMotorSymptoms?: Multioption | string
  // end region

  // region Противосудорожные препараты (ПСП)
  inTheDebut?: string

  followUpTherapy?: string

  currentTherapy?: string

  // valproates: [];

  // valproateAcid: [];

  // karbamazepin: [];

  // lamotridjin: [];

  // levetiracetam: [];

  // topiromat: [];

  // okskarbazepin: [];

  // fenobarbital: [];

  // followValproates: [];

  // followValproateAcid: [];

  // followKarbamazepin: [];

  // followLamotridjin: [];

  // followLevetiracetam: [];

  // followTopiromat: [];

  // followOkskarbazepin: [];

  // followFenobarbital: [];

  // vigabatrin: [];

  // etosuksimid: [];

  // perampanel: [];

  // aktg: [];

  // gidrokortizon: [];

  // zonisamid: [];

  // lakosamid: [];

  // sultiam: [];

  // rufinamid: [];

  // klonazepam: [];

  // klobazam: [];

  // diazepam: [];

  // gabapentin: [];

  // pregabalin: [];

  // stiripentol: [];

  // fenitoin: [];

  // otherPreparates: [];

  healTypes?: string

  effectivenessGrade?: string
  // end region

  // region Фактическая ситуация
  durationOfTheAttack?: string
  // end region

  // region Инструментальное исследование
  typesOfEEG?: string

  resultOfInterictalEEG?: Multioption | string

  prevalenceResultOfInterictalEEG?: Multioption | string

  localization?: Multioption | string

  types?: string

  lateralization?: string
  // end region

  // region Результаты МРТ
  localizationnMRI?: Multioption | string

  lateralizationMRI?: string

  diagnosisMRI?: Multioption | string
  // end region

  // region ПЭТ КТ
  localizationPETCT?: Multioption | string

  lateralizationPETCT?: string

  resultPETCT?: string
  // end region

  lastEditingUser?: string

  registrationDate?: string
}
