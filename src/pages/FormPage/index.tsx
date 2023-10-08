import { useEffect, useState } from 'react'
import { Patient } from '../../types/Patient'
import { FormField, PatientDetailsForm } from './components/PatientDetailsForm'
import { useLocation, useNavigate } from 'react-router-dom'
import { toastUtils } from '../../utils/toastUtils'
import { api } from '../../api/api'
import { objectUtils } from '../../utils/objectUtils'
import { usePatient } from '../../hooks/usePatient'

export const FormPage = (): JSX.Element => {
  const { loadPatientsWithPreviouslySetParams } = usePatient()

  const [form, setForm] = useState(formDefault)

  const [activeTab, setActiveTab] = useState('0')

  const { state } = useLocation()

  const navigate = useNavigate()

  useEffect(() => {
    if (state === null) {
      setForm(formDefault)
    } else {
      let patient = objectUtils.deepCopy(state.state)
      for (const key in patient) {
        if (
          typeof patient[key] === 'string' &&
          (patient[key].startsWith('{"value":') ||
            patient[key].startsWith('{"child":'))
        ) {
          patient[key] = JSON.parse(patient[key])
        }
      }
      setForm(patient)
    }
  }, [])

  const handleInput = (event: any, passedValue?: any) => {
    if (passedValue) {
      setForm(JSON.parse(JSON.stringify(form)))
      return
    }
    if (event.target.type === 'checkbox') {
      let arr: any = form[event.target.id as keyof typeof form]
      if (!arr.includes(event.target.name)) {
        arr.push(event.target.name)
      } else {
        let index = arr.indexOf(event.target.name)
        if (index !== -1) {
          arr.splice(index, 1)
        }
      }
      setForm(JSON.parse(JSON.stringify(form)))
      return
    }
    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value
    if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    const name = event.target.id
    if (
      name === 'iin' ||
      name === 'registrationNumber' ||
      name === 'phoneNumber'
    ) {
      if (!/^\d+$/.test(value) && value !== '') {
        alert('Только числовые значения')
        return
      }
    }
    setForm({ ...form, [name]: value })
  }

  const handleSavePatient = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    let response: any

    if (
      form.iin === '' ||
      form.firstName === '' ||
      form.secondName === '' ||
      form.dateOfBirth === null ||
      form.dateOfBirth === undefined ||
      form.registrationNumber === ''
    ) {
      alert('Не заполены обязательные поля!')
      return
    }

    if (state === null) {
      response = await api.patient.add(form)
    } else {
      response = await api.patient.edit(form)
    }
    if (response?.status === 201 || response?.status === 200) {
      const message =
        response.status === 201 ? 'Пациент сохранен!' : 'Пациент изменен!'
      toastUtils.success(message)
      await loadPatientsWithPreviouslySetParams()
      navigate('/main')
    } else {
      let content = ''
      if (
        response?.response?.data?.message ===
        'Пользователь с таким ИИН уже существует'
      ) {
        content = 'Пользователь с таким ИИН уже существует'
      }
      toastUtils.error(content)
    }
  }

  const handleFormChange = (event: React.MouseEvent<HTMLDivElement>) => {
    setActiveTab(event.currentTarget.id)
  }

  return (
    <div className="container">
      <ul style={{ marginBottom: '1rem' }} className="nav nav-tabs">
        {tabs.map((tab) => (
          <li className="nav-item">
            <div
              id={tab.id + ''}
              onClick={handleFormChange}
              className={
                activeTab === tab.id + '' ? 'nav-link active' : 'nav-link'
              }
              aria-current="page"
            >
              {tab.label}
            </div>
          </li>
        ))}
      </ul>

      {formSchema.map((schema, index) => {
        return (
          activeTab === index + '' && (
            <PatientDetailsForm
              formData={form}
              handleInput={handleInput}
              formFields={schema}
            />
          )
        )
      })}

      <button onClick={handleSavePatient} className="btn btn-primary">
        Сохранить
      </button>
    </div>
  )
}

const tabs = [
  {
    id: 0,
    label: 'Паспортные данные пациента'
  },
  {
    id: 1,
    label: 'Перинатальный анамнез (Anamnesis vitae)'
  },
  {
    id: 2,
    label: 'Анамнез эпилепсии'
  },
  {
    id: 3,
    label: 'Фактическая ситуация'
  },
  {
    id: 4,
    label: 'Противосудорожные препараты (ПСП)'
  },
  {
    id: 5,
    label: 'Инструментальное исследование'
  },
  {
    id: 6,
    label: 'Результат МРТ'
  },
  {
    id: 7,
    label: 'ПЭТ КТ результат'
  }
]

const formDefault: Patient = {
  id: 0,

  // region Passport data
  isResident: true,

  nationality: '',

  isMale: true,

  isRightHanded: true,

  registrationNumber: '',

  firstName: '',

  secondName: '',

  patronymic: '',

  dateOfBirth: null,

  iin: '',

  birthRegion: '',

  birthAddress: '',

  livingRegion: '',

  livingAddress: '',

  phoneNumber: '',

  educationProfession: '',

  dispensaryRegistration: null,

  workStatus: '',

  familyStatus: '',

  isDriver: false,
  // end region

  // region Anamnesis vitae
  childCount: 0,

  pregnancyFeatures: { value: '' },

  childBirthFeatures: { value: '' },

  afterBirthFeatures: { value: '' },

  childEarlyDevelopment: '',
  // end region

  // region Анамнез эпилепсии
  isFS: '',

  neuroinfection: '',

  ageOfTheFirstAttack: { value: '' },

  neonatalAndInfantAge: { value: '' },

  childrenAndYouth: { value: '' },

  actualSituationAdultAndElderly: { value: '' },

  epilepsyType: '',

  icd: '',

  featuresOfSeizures: { value: '' },

  adultAndElderly: { value: '' },

  withMotorSymptoms: { value: '' },

  noMotorSymptoms: { value: '' },
  // end region

  // region Фактическая ситуация
  durationOfTheAttack: '',
  // end region

  // region Противосудорожные препараты (ПСП)
  inTheDebut: '',

  followUpTherapy: '',

  currentTherapy: '',

  // valproates: [],

  // valproateAcid: [],

  // karbamazepin: [],

  // lamotridjin: [],

  // levetiracetam: [],

  // topiromat: [],

  // okskarbazepin: [],

  // fenobarbital: [],

  // followValproates: [],

  // followValproateAcid: [],

  // followKarbamazepin: [],

  // followLamotridjin: [],

  // followLevetiracetam: [],

  // followTopiromat: [],

  // followOkskarbazepin: [],

  // followFenobarbital: [],

  // vigabatrin: [],

  // etosuksimid: [],

  // perampanel: [],

  // aktg: [],

  // gidrokortizon: [],

  // zonisamid: [],

  // lakosamid: [],

  // sultiam: [],

  // rufinamid: [],

  // klonazepam: [],

  // klobazam: [],

  // diazepam: [],

  // gabapentin: [],

  // pregabalin: [],

  // stiripentol: [],

  // fenitoin: [],

  // otherPreparates: [],

  healTypes: '',

  effectivenessGrade: '',
  // end region

  // region Инструментальное исследование
  typesOfEEG: '',

  resultOfInterictalEEG: { value: '' },

  prevalenceResultOfInterictalEEG: { value: '' },

  localization: { value: '' },

  types: '',

  lateralization: '',
  // end region

  // region Результат МРТ
  localizationnMRI: { value: '' },

  lateralizationMRI: '',

  diagnosisMRI: { value: '' },

  // end region

  // region ПЭТ КТ
  localizationPETCT: { value: '' },

  lateralizationPETCT: '',

  resultPETCT: '',
  // end region

  lastEditingUser: '',

  registrationDate: new Date()
}

const formFieldsPassportData: FormField[] = [
  {
    name: 'isResident',
    label: 'Резидент РК',
    type: 'options',
    options: [
      {
        label: 'Да',
        value: 'true'
      },
      {
        label: 'Нет',
        value: 'false'
      }
    ]
  },
  {
    name: 'nationality',
    label: 'Национальность',
    type: 'options',
    options: [
      {
        label: 'Казах',
        value: 'Казах'
      },
      {
        label: 'Русский',
        value: 'Русский'
      },
      {
        label: 'Узбек',
        value: 'Узбек'
      },
      {
        label: 'Другое',
        value: 'Другое',
        isOther: true
      }
    ]
  },
  {
    name: 'isMale',
    label: 'Пол',
    type: 'options',
    options: [
      {
        label: 'Мужчина',
        value: 'true'
      },
      {
        label: 'Женщина',
        value: 'false'
      }
    ]
  },
  {
    name: 'isRightHanded',
    label: 'Доминантная рука',
    type: 'options',
    options: [
      {
        label: 'Левша',
        value: 'false'
      },
      {
        label: 'Правша',
        value: 'true'
      }
    ]
  },
  {
    name: 'registrationNumber',
    label: 'ID № (Номер регистрации)',
    type: 'text'
  },
  {
    name: 'firstName',
    label: 'Имя',
    type: 'text'
  },
  {
    name: 'secondName',
    label: 'Фамилия',
    type: 'text'
  },
  {
    name: 'patronymic',
    label: 'Отчество',
    type: 'text'
  },
  {
    name: 'dateOfBirth',
    label: 'Дата рождения',
    type: 'date'
  },
  {
    name: 'iin',
    label: 'ИИН (для не резидентов номер пасспорта)',
    type: 'text'
  },
  {
    name: 'birthRegion',
    label: 'Область рождения',
    type: 'options',
    options: [
      {
        label: 'Астана',
        value: 'Астана'
      },
      {
        label: 'Алматы',
        value: 'Алматы'
      },
      {
        label: 'Шымкент',
        value: 'Шымкент'
      },
      {
        label: 'Область Абай',
        value: 'Область Абай'
      },
      {
        label: 'Акмолинская область',
        value: 'Акмолинская область'
      },
      {
        label: 'Актюбинская область',
        value: 'Актюбинская область'
      },
      {
        label: 'Алматинская область',
        value: 'Алматинская область'
      },
      {
        label: 'Атырауская область',
        value: 'Атырауская область'
      },
      {
        label: 'Жамбылская область',
        value: 'Жамбылская область'
      },
      {
        label: 'Область Жетісу',
        value: 'Область Жетісу'
      },
      {
        label: 'Западно-Казахстанская область',
        value: 'Западно-Казахстанская область'
      },
      {
        label: 'Карагандинская область',
        value: 'Карагандинская область'
      },
      {
        label: 'Костанайская область',
        value: 'Костанайская область'
      },
      {
        label: 'Кызылординская область',
        value: 'Кызылординская область'
      },
      {
        label: 'Мангистауская область',
        value: 'Мангистауская область'
      },
      {
        label: 'Павлодарская область',
        value: 'Павлодарская область'
      },
      {
        label: 'Северо-Казахстанская область',
        value: 'Северо-Казахстанская область'
      },
      {
        label: 'Туркестанская область',
        value: 'Туркестанская область'
      },
      {
        label: 'Область Ұлытау',
        value: 'Область Ұлытау'
      }
    ]
  },
  {
    name: 'birthAddress',
    label: 'Место рождения',
    type: 'text'
  },
  {
    name: 'livingRegion',
    label: 'Область проживания',
    type: 'options',
    options: [
      {
        label: 'Астана',
        value: 'Астана'
      },
      {
        label: 'Алматы',
        value: 'Алматы'
      },
      {
        label: 'Шымкент',
        value: 'Шымкент'
      },
      {
        label: 'Область Абай',
        value: 'Область Абай'
      },
      {
        label: 'Акмолинская область',
        value: 'Акмолинская область'
      },
      {
        label: 'Актюбинская область',
        value: 'Актюбинская область'
      },
      {
        label: 'Алматинская область',
        value: 'Алматинская область'
      },
      {
        label: 'Атырауская область',
        value: 'Атырауская область'
      },
      {
        label: 'Жамбылская область',
        value: 'Жамбылская область'
      },
      {
        label: 'Область Жетісу',
        value: 'Область Жетісу'
      },
      {
        label: 'Западно-Казахстанская область',
        value: 'Западно-Казахстанская область'
      },
      {
        label: 'Карагандинская область',
        value: 'Карагандинская область'
      },
      {
        label: 'Костанайская область',
        value: 'Костанайская область'
      },
      {
        label: 'Кызылординская область',
        value: 'Кызылординская область'
      },
      {
        label: 'Мангистауская область',
        value: 'Мангистауская область'
      },
      {
        label: 'Павлодарская область',
        value: 'Павлодарская область'
      },
      {
        label: 'Северо-Казахстанская область',
        value: 'Северо-Казахстанская область'
      },
      {
        label: 'Туркестанская область',
        value: 'Туркестанская область'
      },
      {
        label: 'Область Ұлытау',
        value: 'Область Ұлытау'
      }
    ]
  },
  {
    name: 'livingAddress',
    label: 'Место проживания',
    type: 'text'
  },
  {
    name: 'phoneNumber',
    label: 'Номер телефона',
    type: 'text'
  },
  {
    name: 'socialPosition',
    label: 'Социальное положение',
    type: 'label'
  },
  {
    name: 'educationProfession',
    label: 'Образование/Профессия',
    type: 'options',
    options: [
      {
        label: 'Дошкольное воспитание и обучение',
        value: 'Дошкольное воспитание и обучение'
      },
      {
        label: 'Среднее образование',
        value: 'Среднее образование'
      },
      {
        label: 'Высшее образование и послевузовское проф образование',
        value: 'Высшее образование и послевузовское проф образование'
      }
    ]
  },
  {
    name: 'dispensaryRegistration',
    label: 'Диспансерный учет (дата учета)',
    type: 'date'
  },
  {
    name: 'workStatus',
    label: 'Занятость',
    type: 'options',
    options: [
      {
        label: 'Работает',
        value: 'Работает'
      },
      {
        label: 'Временно не работает',
        value: 'Временно не работает'
      },
      {
        label: 'Не работает',
        value: 'Не работает'
      }
    ]
  },
  {
    name: 'familyStatus',
    label: 'Семейное положение',
    type: 'options',
    options: [
      {
        label: 'Женат/Замужем',
        value: 'Женат/Замужем'
      },
      {
        label: 'Не женат/замужем',
        value: 'Не женат/замужем'
      },
      {
        label: 'Разведен(а)',
        value: 'Разведен(а)'
      }
    ]
  },
  {
    name: 'isDriver',
    label: 'Вождение авто',
    type: 'options',
    options: [
      {
        label: 'Да',
        value: 'true'
      },
      {
        label: 'Нет',
        value: 'false'
      }
    ]
  }
]

const formFieldsAnamnesisVitae: FormField[] = [
  {
    name: 'childCount',
    label: 'Ребенок по счету',
    type: 'number'
  },
  {
    name: 'pregnancyFeatures',
    label: 'Особенности течение беременности (антенатальный период)',
    type: 'multioptions',
    options: [
      {
        label: 'Не известно',
        value: 'Не известно'
      },
      {
        label: 'Нормально',
        value: 'Нормально'
      },
      {
        label: 'Были особенности',
        value: 'Были особенности',
        isCheckbox: true,
        options: [
          {
            label: 'Cвязано с роженицей',
            value: 'Cвязано с роженицей',
            isCheckbox: true,
            options: [
              {
                label: 'ВПС',
                value: 'ВПС'
              },
              {
                label: 'Анемия',
                value: 'Анемия',
                options: [
                  {
                    label: 'Легкой степени',
                    value: 'Легкой степени'
                  },
                  {
                    label: 'Средней степени',
                    value: 'Средней степени'
                  },
                  {
                    label: 'Тяжелой степени',
                    value: 'Тяжелой степени'
                  }
                ]
              },
              {
                label: 'Патология щитовидной железы',
                value: 'Патология щитовидной железы',
                options: [
                  {
                    label: 'Тиреотоксикоз',
                    value: 'Тиреотоксикоз'
                  },
                  {
                    label: 'Гипотиреоз',
                    value: 'Гипотиреоз'
                  }
                ]
              },
              {
                label: 'АГ',
                value: 'АГ'
              },
              {
                label: 'СД',
                value: 'СД'
              },
              {
                label: 'Васкулиты',
                value: 'Васкулиты'
              },
              {
                label: 'Другое',
                value: 'Другое'
              }
            ]
          },

          {
            label: 'Связано с плодом',
            value: 'Связано с плодом',
            isCheckbox: true,
            options: [
              {
                label: 'УПБ',
                value: 'УПБ'
              },
              {
                label: 'Гипертонус',
                value: 'Гипертонус'
              },
              {
                label: 'Анемия',
                value: 'Анемия'
              },
              {
                label: 'Преэклампсия',
                value: 'Преэклампсия'
              },
              {
                label: 'ЗВУР',
                value: 'ЗВУР'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'childBirthFeatures',
    label: 'Особенности родов (интранатальный период)',
    type: 'multioptions',
    options: [
      {
        label: 'Не известно',
        value: 'Не известно'
      },
      {
        label: 'Без особенности',
        value: 'Без особенности'
      },
      {
        label: 'Были особенности',
        value: 'Были особенности',
        isCheckbox: true,
        options: [
          {
            label: 'Преждевременные роды',
            value: 'Преждевременные роды',
            isCheckbox: true,
            options: [
              {
                label: 'Недоношенный (до 37 нед)',
                value: 'Недоношенный (до 37 нед)'
              },
              {
                label: 'Доношенный',
                value: 'Доношенный'
              }
            ]
          },
          {
            label: 'Родовая травма',
            value: 'Родовая травма',
            isCheckbox: true,
            options: [
              {
                label: 'Кефалогематома',
                value: 'Кефалогематома'
              },
              {
                label: 'Тазовое предлежание',
                value: 'Тазовое предлежание'
              },
              {
                label: 'Ножное предлежание',
                value: 'Ножное предлежание'
              }
            ]
          },
          {
            label: 'Обвитие пуповиной вокруг шеи',
            value: 'Обвитие пуповиной вокруг шеи',
            isCheckbox: true,
            options: [
              {
                label: 'Тугое',
                value: 'Тугое',
                options: [
                  {
                    label: '1 кратное',
                    value: '1 кратное'
                  },
                  {
                    label: '2-х кратное',
                    value: '2-х кратное'
                  },
                  {
                    label: '3-х кратное',
                    value: '3-х кратное'
                  }
                ]
              },
              {
                label: 'Не тугое',
                value: 'Не тугое',
                options: [
                  {
                    label: '1 кратное',
                    value: '1 кратное'
                  },
                  {
                    label: '2-х кратное',
                    value: '2-х кратное'
                  },
                  {
                    label: '3-х кратное',
                    value: '3-х кратное'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'afterBirthFeatures',
    label: 'Особенности после родов (постнатальный период)',
    type: 'multioptions',
    options: [
      {
        label: 'Нет',
        value: 'Нет'
      },
      {
        label: 'Не известно',
        value: 'Не известно'
      },
      {
        label: 'Есть',
        value: 'Есть',
        isCheckbox: true,
        options: [
          {
            label: 'Желтушность',
            value: 'Желтушность'
          },
          {
            label: 'ОАРИТ/ПИТ',
            value: 'ОАРИТ/ПИТ'
          },
          {
            label: '2-й этап выхаживание',
            value: '2-й этап выхаживание'
          }
        ]
      }
    ]
  },
  {
    name: 'childEarlyDevelopment',
    label: 'Ранее развитие (формула развития ребенка)',
    type: 'options',
    options: [
      {
        label: 'Норма',
        value: 'Норма'
      },
      {
        label: 'Задержка развития (до эпилепсии и после эпилепсии)',
        value: 'Задержка развития (до эпилепсии и после эпилепсии)'
      }
    ]
  }
]

const formFieldsAnamnesisEpilepsy: FormField[] = [
  {
    name: 'isFS',
    label: 'ФС',
    type: 'options',
    options: [
      {
        label: 'Да',
        value: 'Да'
      },
      {
        label: 'Нет',
        value: 'Нет'
      },
      {
        label: 'Не известно',
        value: 'Не известно'
      }
    ]
  },
  {
    name: 'neuroinfection',
    label: 'Нейроинфекция',
    type: 'options',
    options: [
      {
        label: 'Менингит',
        value: 'Менингит'
      },
      {
        label: 'Энцефалит',
        value: 'Энцефалит'
      },
      {
        label: 'Другое',
        value: 'Другое'
      }
    ]
  },
  {
    name: 'ageOfTheFirstAttack',
    label: 'Возраст первого приступа (полный возраст)',
    type: 'multioptions',
    options: [
      {
        label: 'Взрослый',
        value: 'Взрослый',
        options: [
          {
            label: '18-44 молодой',
            value: '18-44 молодой'
          },
          {
            label: '45-59 средний',
            value: '45-59 средний'
          },
          {
            label: '60-74 пожилой',
            value: '60-74 пожилой'
          },
          {
            label: '75-90 старческий',
            value: '75-90 старческий'
          },
          {
            label: '90 и выше долгожители',
            value: '90 и выше долгожители'
          }
        ]
      },
      {
        label: 'Детский ',
        value: 'Детский',
        options: [
          {
            label: 'до 1 года младенчество',
            value: '18-44 молодой'
          },
          {
            label: 'ранее детство 1-3',
            value: 'ранее детство 1-3'
          },
          {
            label: 'дошкольное детство – 3-6',
            value: 'дошкольное детство – 3-6'
          },
          {
            label: 'младший школьный 6-7 и 10-11',
            value: 'младший школьный 6-7 и 10-11'
          },
          {
            label: 'подростковый 10-11 и до 14-15 л',
            value: 'подростковый 10-11 и до 14-15 л'
          },
          {
            label: 'юношеский 14-18',
            value: 'юношеский 14-18'
          }
        ]
      }
    ]
  },
  {
    name: 'seizuresTypes',
    label: 'Типы приступов',
    type: 'label'
  },
  {
    name: 'neonatalAndInfantAge',
    label: 'неонатальный и младенческий возраст:',
    type: 'multioptions',
    options: [
      {
        label: 'типы приступов',
        value: 'типы приступов',
        isCheckbox: true,
        options: [
          {
            label: 'тонический',
            value: 'тонический',
            isCheckbox: true,
            options: [
              {
                label: 'фокальный',
                value: 'фокальный'
              },
              {
                label: 'билатеральный симметричный',
                value: 'билатеральный симметричный'
              },
              {
                label: 'билатеральный асимметричный',
                value: 'билатеральный асимметричный'
              }
            ]
          },
          {
            label: 'клонический',
            value: 'клонический',
            isCheckbox: true,
            options: [
              {
                label: 'фокальный',
                value: 'фокальный'
              },
              {
                label: 'мультифокальный',
                value: 'мультифокальный'
              },
              {
                label: 'билатеральный',
                value: 'билатеральный'
              }
            ]
          },
          {
            label: 'миоклонический',
            value: 'миоклонический',
            isCheckbox: true,
            options: [
              {
                label: 'фокальный',
                value: 'фокальный'
              },
              {
                label: 'мультифокальный',
                value: 'мультифокальный'
              },
              {
                label: 'билатеральный симметричный',
                value: 'билатеральный симметричный'
              },
              {
                label: 'билатеральный асимметричный',
                value: 'билатеральный асимметричный'
              }
            ]
          },
          {
            label: 'эпилептический спазм',
            value: 'эпилептический спазм',
            isCheckbox: true,
            options: [
              {
                label: 'унилатеральный',
                value: 'унилатеральный'
              },
              {
                label: 'билатеральный симметричный',
                value: 'билатеральный симметричный'
              },
              {
                label: 'билатеральный асимметричный',
                value: 'билатеральный асимметричный'
              }
            ]
          },
          {
            label: 'автоматизмы',
            value: 'автоматизмы',
            isCheckbox: true,
            options: [
              {
                label: 'унилатеральный',
                value: 'унилатеральный'
              },
              {
                label: 'билатеральный симметричный',
                value: 'билатеральный симметричный'
              },
              {
                label: 'билатеральный асимметричный',
                value: 'билатеральный асимметричный'
              }
            ]
          }
        ]
      },
      {
        label: 'синдромы',
        value: 'синдромы',
        isCheckbox: true,
        options: [
          {
            label: 'эволюционная и эпилептическая энцефалопатия (ЭЭЭ)',
            value: 'эволюционная и эпилептическая энцефалопатия (ЭЭЭ)',
            isCheckbox: true,
            options: [
              {
                label:
                  'ранняя младенческая эволюционная и эпилептическая энцефалопатия',
                value:
                  'ранняя младенческая эволюционная и эпилептическая энцефалопатия'
              },
              {
                label:
                  'эпилепсия младенчества с мигрирующими фокальными приступами',
                value:
                  'эпилепсия младенчества с мигрирующими фокальными приступами'
              },
              {
                label: 'синдром инфантильных эпилептический спазмов',
                value: 'синдром инфантильных эпилептический спазмов'
              },
              {
                label: 'синдром Драве',
                value: 'синдром Драве'
              }
            ]
          }
        ]
      },
      {
        label: 'этиологически специфические синдромы',
        value: 'этиологически специфические синдромы',
        isCheckbox: true,
        options: [
          {
            label: 'KCNQ2-DEE',
            value: 'KCNQ2-DEE'
          },
          {
            label: 'PD-DEE',
            value: 'PD-DEE'
          },
          {
            label: 'PNPO-DEE',
            value: 'PNPO-DEE'
          },
          {
            label: 'P5PD-DEE',
            value: 'P5PD-DEE'
          },
          {
            label: 'CDKL5-DEE',
            value: 'CDKL5-DEE'
          },
          {
            label: 'PCDH19',
            value: 'PCDH19'
          },
          {
            label: 'GLUT1DS',
            value: 'GLUT1DS'
          },
          {
            label: 'SWS',
            value: 'SWS'
          },
          {
            label: 'GS-HH',
            value: 'GS-HH'
          }
        ]
      }
    ]
  },
  {
    name: 'childrenAndYouth',
    label: 'детский и юношеский возраст',
    type: 'multioptions',
    options: [
      {
        label: 'фокальные эпилептические синдромы',
        value: 'фокальные эпилептические синдромы',
        isCheckbox: true,
        options: [
          {
            label: 'самокупирующиеся эпилепсия с центро-темпоральными спайками',
            value: 'самокупирующиеся эпилепсия с центро-темпоральными спайками'
          },
          {
            label: 'самокупирующиеся эпилепсия с вегетативными приступами',
            value: 'самокупирующиеся эпилепсия с вегетативными приступами'
          },
          {
            label: 'детская затылочная зрительная эпилепсия',
            value: 'детская затылочная зрительная эпилепсия'
          },
          {
            label: 'фотосенситивная затылочная эпилепсия',
            value: 'фотосенситивная затылочная эпилепсия'
          },
          {
            label: 'автоматизмы',
            value: 'автоматизмы'
          }
        ]
      },
      {
        label: 'генерализованная генетическая эпилепсия',
        value: 'генерализованная генетическая эпилепсия',
        isCheckbox: true,
        options: [
          {
            label: 'детская абсансная эпилепсия',
            value: 'детская абсансная эпилепсия'
          },
          {
            label: 'юношеская абсансная эпилепсия',
            value: 'юношеская абсансная эпилепсия'
          },
          {
            label: 'юношеская миоклоническая эпилепсия',
            value: 'юношеская миоклоническая эпилепсия'
          },
          {
            label: 'изолированная ГСП',
            value: 'изолированная ГСП'
          },
          {
            label: 'ГСП пробуждения',
            value: 'ГСП пробуждения'
          }
        ]
      },
      {
        label: 'фокальная эпилепсия',
        value: 'фокальная эпилепсия',
        isCheckbox: true,
        options: [
          {
            label: 'лобная',
            value: 'лобная'
          },
          {
            label: 'теменная',
            value: 'теменная'
          },
          {
            label: 'височная',
            value: 'височная'
          },
          {
            label: 'затылочная ',
            value: 'затылочная '
          }
        ]
      }
    ]
  },
  {
    name: 'adultAndElderly',
    label: 'взрослый и пожилой возраст',
    type: 'multioptions',
    options: [
      {
        label: 'фокальное начало',
        value: 'фокальное начало',
        isCheckbox: true,
        options: [
          {
            label: 'Осознанный',
            value: 'Осознанный',
            options: [
              {
                label: 'моторный',
                value: 'моторный'
              },
              {
                label: 'не моторный',
                value: 'не моторный'
              }
            ]
          },
          {
            label: 'Нарушения осознанности',
            value: 'Нарушения осознанности',
            options: [
              {
                label: 'моторный',
                value: 'моторный'
              },
              {
                label: 'не моторный',
                value: 'не моторный'
              }
            ]
          },
          {
            label:
              'билатеральный тонико-клонический приступ с фокальным дебютом',
            value:
              'билатеральный тонико-клонический приступ с фокальным дебютом'
          }
        ]
      },
      {
        label: 'генерализованное начало',
        value: 'генерализованное начало',
        options: [
          {
            label: 'моторный',
            value: 'моторный',
            isCheckbox: true,
            options: [
              {
                label: 'тонико-клонический приступ',
                value: 'тонико-клонический приступ'
              },
              {
                label: 'другие моторные приступы',
                value: 'другие моторные приступы'
              }
            ]
          },
          {
            label: 'не моторный',
            value: 'не моторный',
            isCheckbox: true,
            options: [
              {
                label: ' абсансный приступ',
                value: ' абсансный приступ'
              }
            ]
          }
        ]
      },
      {
        label: 'приступ с неизвестным началом',
        value: 'приступ с неизвестным началом',
        options: [
          {
            label: 'моторный',
            value: 'моторный'
          },
          {
            label: 'не моторный',
            value: 'не моторный'
          },
          {
            label: 'не классифицируемый',
            value: 'не классифицируемый'
          }
        ]
      }
    ]
  },
  {
    name: 'epilepsyStatus',
    label: 'Эпилептический статус (ЭС):',
    type: 'label'
  },
  {
    name: 'withMotorSymptoms',
    label: 'с выраженными двигательными симптомами',
    type: 'multioptions',
    options: [
      {
        label: 'судорожный ЭС',
        value: 'судорожный ЭС',
        options: [
          {
            label: 'генерализованный судорожный ЭС',
            value: 'генерализованный судорожный ЭС'
          },
          {
            label: 'фокальное начало, переходящее в двусторонний судорожный ЭС',
            value: 'фокальное начало, переходящее в двусторонний судорожный ЭС'
          },
          {
            label: 'неизвестно, фокальный или генерализованный',
            value: 'неизвестно, фокальный или генерализованный'
          }
        ]
      },
      {
        label:
          'миоклонический ЭС (выраженные эпилептические миоклонические подергивание)',
        value:
          'миоклонический ЭС (выраженные эпилептические миоклонические подергивание)',
        options: [
          {
            label: 'с комой',
            value: 'с комой'
          },
          {
            label: 'без комы',
            value: 'без комы'
          }
        ]
      },
      {
        label: 'фокальный моторный',
        value: 'фокальный моторный',
        options: [
          {
            label: 'повторяющиеся фокальные моторные приступы (Джексоновские)',
            value: 'повторяющиеся фокальные моторные приступы (Джексоновские)'
          },
          {
            label: 'продолженная парциальная эпилепсия',
            value: 'продолженная парциальная эпилепсия'
          },
          {
            label: 'Адверсивный статус',
            value: 'Адверсивный статус'
          },
          {
            label: 'Окулоклонический статус',
            value: 'Окулоклонический статус'
          },
          {
            label: 'Иктальный парез (фокальный паралитический ЭС)',
            value: 'Иктальный парез (фокальный паралитический ЭС)'
          }
        ]
      },
      {
        label: 'тонический статус',
        value: 'тонический статус'
      },
      {
        label: 'гиперкинетический ЭС',
        value: 'гиперкинетический ЭС'
      }
    ]
  },
  {
    name: 'noMotorSymptoms',
    label: 'без выраженной двигательной симптоматики (без судорожный ЭС)',
    type: 'multioptions',
    options: [
      {
        label: 'без судорожный ЭС с комой',
        value: 'без судорожный ЭС с комой'
      },
      {
        label: 'без судорожный ЭС без комы',
        value: 'без судорожный ЭС без комы',
        options: [
          {
            label: 'генерализованный',
            value: 'генерализованный',
            options: [
              {
                label: 'статус типичного абсанса',
                value: 'статус типичного абсанса'
              },
              {
                label: 'статус миоклонического абсанса',
                value: 'статус миоклонического абсанса'
              },
              {
                label: 'статус атипичного абсанса',
                value: 'статус атипичного абсанса'
              }
            ]
          },
          {
            label: 'фокальный',
            value: 'фокальный',
            options: [
              {
                label: 'продолженная аура',
                value: 'продолженная аура'
              },
              {
                label: 'сенсорными',
                value: 'сенсорными'
              },
              {
                label: 'зрительными',
                value: 'зрительными'
              },
              {
                label: 'обонятельными',
                value: 'обонятельными'
              },
              {
                label: 'вкусовыми',
                value: 'вкусовыми'
              },
              {
                label:
                  'эмоциональными/психическими/эмпирическими или слуховыми симптомами',
                value:
                  'эмоциональными/психическими/эмпирическими или слуховыми симптомами'
              }
            ]
          },
          {
            label: 'неизвестно, фокальный или генерализованный',
            value: 'неизвестно, фокальный или генерализованный',
            options: [{ label: 'вегетативный ЭС', value: 'вегетативный ЭС' }]
          }
        ]
      }
    ]
  }
]

const formFieldActualSituation: FormField[] = [
  {
    name: 'actualSituationAdultAndElderly',
    label: 'взрослый и пожилой возраст',
    type: 'multioptions',
    options: [
      {
        label: 'фокальное начало',
        value: 'фокальное начало',
        isCheckbox: true,
        options: [
          {
            label: 'Осознанный',
            value: 'Осознанный',
            options: [
              {
                label: 'моторный',
                value: 'моторный'
              },
              {
                label: 'не моторный',
                value: 'не моторный'
              }
            ]
          },
          {
            label: 'Нарушения осознанности',
            value: 'Нарушения осознанности',
            options: [
              {
                label: 'моторный',
                value: 'моторный'
              },
              {
                label: 'не моторный',
                value: 'не моторный'
              }
            ]
          },
          {
            label:
              'билатеральный тонико-клонический приступ с фокальным дебютом',
            value:
              'билатеральный тонико-клонический приступ с фокальным дебютом'
          }
        ]
      },
      {
        label: 'генерализованное начало',
        value: 'генерализованное начало',
        options: [
          {
            label: 'моторный',
            value: 'моторный',
            isCheckbox: true,
            options: [
              {
                label: 'тонико-клонический приступ',
                value: 'тонико-клонический приступ'
              },
              {
                label: 'другие моторные приступы',
                value: 'другие моторные приступы'
              }
            ]
          },
          {
            label: 'не моторный',
            value: 'не моторный',
            isCheckbox: true,
            options: [
              {
                label: ' абсансный приступ',
                value: ' абсансный приступ'
              }
            ]
          }
        ]
      },
      {
        label: 'приступ с неизвестным началом',
        value: 'приступ с неизвестным началом',
        options: [
          {
            label: 'моторный',
            value: 'моторный'
          },
          {
            label: 'не моторный',
            value: 'не моторный'
          },
          {
            label: 'не классифицируемый',
            value: 'не классифицируемый'
          }
        ]
      }
    ]
  },
  {
    name: 'epilepsyType',
    label: 'Тип эпилепсий',
    type: 'options',
    options: [
      {
        label: 'фокальная',
        value: 'фокальная'
      },
      {
        label: 'генерализованная',
        value: 'генерализованная'
      },
      {
        label: 'комбинированная',
        value: 'комбинированная'
      },
      {
        label: 'неуточненная',
        value: 'неуточненная'
      }
    ]
  },
  {
    name: 'icd',
    label: 'МКБ-10',
    type: 'options',
    options: [
      {
        label: 'G40.1',
        value: 'G40.1'
      },
      {
        label: 'G40.2',
        value: 'G40.2'
      },
      {
        label: 'G40.3',
        value: 'G40.3'
      },
      {
        label: 'G40.4',
        value: 'G40.4'
      },
      {
        label: 'G40.5',
        value: 'G40.5'
      },
      {
        label: 'G40.6',
        value: 'G40.6'
      },
      {
        label: 'G40.7',
        value: 'G40.7'
      },
      {
        label: 'G40.8',
        value: 'G40.8'
      },
      {
        label: 'G40.9',
        value: 'G40.9'
      },
      {
        label: 'G40.9',
        value: 'G40.9'
      },
      {
        label: 'G41.1',
        value: 'G41.1'
      },
      {
        label: 'G41.2',
        value: 'G41.2'
      },
      {
        label: 'G41.8',
        value: 'G41.8'
      },
      {
        label: 'G41.9',
        value: 'G41.9'
      },
      {
        label: 'Другое',
        value: 'Другое',
        isOther: true
      }
    ]
  },
  {
    name: 'durationOfTheAttack',
    label: 'Длительность приступа',
    type: 'options',
    options: [
      {
        label: 'до 30 сек',
        value: 'до 30 сек'
      },
      {
        label: 'до 1 мин',
        value: 'до 1 мин'
      },
      {
        label: '1-5 мин',
        value: '1-5 мин'
      },
      {
        label: '5-10 мин',
        value: '5-10 мин'
      },
      {
        label: '>10 мин',
        value: '>10 мин'
      }
    ]
  },
  {
    name: 'featuresOfSeizures',
    label: 'Особенности приступов',
    type: 'multioptions',
    options: [
      {
        label: 'только дневные',
        value: 'только дневные'
      },
      {
        label: 'только ночные',
        value: 'только ночные'
      },
      {
        label: 'рефлекторные приступы (стартл эпилепсии)',
        value: 'рефлекторные приступы (стартл эпилепсии)',
        isCheckbox: true,
        options: [
          {
            label: 'фотосенситивные',
            value: 'фотосенситивные'
          },
          {
            label: 'чтение',
            value: 'чтение'
          },
          {
            label: 'шум/громкий звук/музыка',
            value: 'шум/громкий звук/музыка'
          },
          {
            label: 'прикосновение/контакт',
            value: 'прикосновение/контакт'
          },
          {
            label: 'холод/горящий',
            value: 'холод/горящий'
          }
        ]
      },
      {
        label: 'приступы перед/во время менструального цикла',
        value: 'приступы перед/во время менструального цикла'
      }
    ]
  }
]

const formFieldAnticonvulsantDrugs: FormField[] = [
  {
    name: 'inTheDebut',
    label: 'В дебюте',
    type: 'options',
    options: [
      {
        label: 'Вальпроаты',
        value: 'Вальпроаты'
      },
      {
        label: 'Вальпроевая кислота',
        value: 'Вальпроевая кислота'
      },
      {
        label: 'Карбамазепин',
        value: 'Карбамазепин'
      },
      {
        label: 'Ламотриджин',
        value: 'Ламотриджин'
      },
      {
        label: 'Леветирацетам',
        value: 'Леветирацетам'
      },
      {
        label: 'Топиромат',
        value: 'Топиромат'
      },
      {
        label: 'Окскарбазепин',
        value: 'Окскарбазепин'
      },
      {
        label: 'Фенобарбитал',
        value: 'Фенобарбитал'
      },
      {
        label: 'Другое',
        value: 'Другое',
        isOther: true
      }
    ]
  },

  /*
  {
    name: "valproates",
    label: "Вальпроаты",
    type: "checkbox",
    boxes:[
      {
        label: "Депакин сироп",
        name: "Депакин сироп",
      },
      {
        label: "Депакин хроно",
        name: "Депакин хроно",
      },
      {
        label: "Депакин хроносфера",
        name: "Депакин хроносфера",
      },
      {
        label: "Энкорат хроно",
        name: "Энкорат хроно",
      },
      {
        label: "Дивальпроекс",
        name: "Дивальпроекс",
      },
      {
        label: "Депакоте",
        name: "Депакоте",
      },
    ]
  },
  {
    name: "valproateAcid",
    label: "Вальпроевая кислота",
    type: "checkbox",
    boxes:[
      {
        label: "Конвулекс сироп/капли",
        name: "Конвулекс сироп/капли",
      },
      {
        label: "Конвулекс в/в",
        name: "Конвулекс в/в",
      },
      {
        label: "Конвулекс таблетка/капсула",
        name: "Конвулекс таблетка/капсула",
      },
      {
        label: "Вальпрокс",
        name: "Вальпрокс",
      },
    ]
  },
  {
    name: "karbamazepin",
    label: "Карбамазепин",
    type: "checkbox",
    boxes:[
      {
        label: "Финлепсин",
        name: "Финлепсин",
      },
      {
        label: "Финлепсин ретард",
        name: "Финлепсин ретард",
      },
      {
        label: "Карбалекс",
        name: "Карбалекс",
      },
      {
        label: "Зептол",
        name: "Зептол",
      },
      {
        label:"Тегретол",
        name:"Тегретол",
      },
      {
        label:"Мезакар СР",
        name:"Мезакар СР",
      },
      {
        label:"Другое",
        name:"Другое Карбамазепин"
      }
    ]
  },
  {
    name: "lamotridjin",
    label: "Ламотриджин",
    type: "checkbox",
    boxes:[
      {
        label: "Ламиктал",
        name: "Ламиктал",
      },
      {
        label: "Риджинол",
        name: "Риджинол",
      },
      {
        label: "Ламотрикс",
        name: "Ламотрикс",
      },
      {
        label: "Риджинол",
        name: "Риджинол",
      },
      {
        label:"Ламолеп",
        name:"Ламолеп",
      },
      {
        label:"Ламитор",
        name:"Ламитор",
      },
      {
        label:"Другое",
        name:"Другое Ламотриджин"
      }
    ]
  },
  {
    name: "levetiracetam",
    label: "Леветирацетам",
    type: "checkbox",
    boxes:[
      {
        label: "Кеппра сироп",
        name: "Кеппра сироп",
      },
      {
        label: "Кеппра таблетка",
        name: "Кеппра таблетка",
      },
      {
        label: "Эпикс",
        name: "Эпикс",
      },
      {
        label: "Леветирацетам Тева",
        name: "Леветирацетам Тева",
      },
      {
        label:"Эвалеп",
        name:"Эвалеп",
      },
      {
        label:"Другое",
        name:"Другое Леветирацетам"
      }
    ]
  },
  {
    name: "topiromat",
    label: "Топиромат",
    type: "checkbox",
    boxes:[
      {
        label: "Топамакс",
        name: "Топамакс",
      },
      {
        label: "Топивитэ",
        name: "Топивитэ",
      },
      {
        label: "Топирол",
        name: "Топирол",
      },
      {
        label: "Эпирамат Тева",
        name: "Эпирамат Тева",
      },
      {
        label:"Другое",
        name:"Другое Топиромат"
      }
    ]
  },
  {
    name: "okskarbazepin",
    label: "Окскарбазепин",
    type: "checkbox",
    boxes:[
      {
        label: "Оксапин",
        name: "Оксапин",
      },
      {
        label: "Трилептал",
        name: "Трилептал",
      },
    ]
  },
  {
    name: "fenobarbital",
    label: "Фенобарбитал",
    type: "checkbox",
    boxes:[
      {
        label: "Бензонал",
        name: "Бензонал",
      },
      {
        label: "Люминал",
        name: "Люминал",
      },
      {
        label: "Фенобарбитал",
        name: "Фенобарбитал",
      },
      {
        label:"Другое",
        name:"Другое Фенобарбитал"
      }
    ]
  },
  */

  //ПОСЛЕДУЮЩАЯ ТЕРАПИЯ
  {
    name: 'followUpTherapy',
    label: 'Последующая терапия',
    type: 'options',
    options: [
      {
        label: 'Вальпроаты',
        value: 'Вальпроаты'
      },
      {
        label: 'Вальпроевая кислота',
        value: 'Вальпроевая кислота'
      },
      {
        label: 'Карбамазепин',
        value: 'Карбамазепин'
      },
      {
        label: 'Ламотриджин',
        value: 'Ламотриджин'
      },
      {
        label: 'Леветирацетам',
        value: 'Леветирацетам'
      },
      {
        label: 'Топиромат',
        value: 'Топиромат'
      },
      {
        label: 'Окскарбазепин',
        value: 'Окскарбазепин'
      },
      {
        label: 'Фенобарбитал',
        value: 'Фенобарбитал'
      },
      {
        label: 'Вигабатрин',
        value: 'Вигабатрин'
      },
      {
        label: 'Этосуксимид',
        value: 'Этосуксимид'
      },
      {
        label: 'Перампанел',
        value: 'Перампанел'
      },
      {
        label: 'АКТГ',
        value: 'АКТГ'
      },
      {
        label: 'Гидрокортизон',
        value: 'Гидрокортизон'
      },
      {
        label: 'Зонисамид',
        value: 'Зонисамид'
      },
      {
        label: 'Лакосамид',
        value: 'Лакосамид'
      },
      {
        label: 'Сультиам',
        value: 'Сультиам'
      },
      {
        label: 'Руфинамид',
        value: 'Руфинамид'
      },
      {
        label: 'Клоназепам',
        value: 'Клоназепам'
      },
      {
        label: 'Клобазам',
        value: 'Клобазам'
      },
      {
        label: 'Диазепам',
        value: 'Диазепам'
      },
      {
        label: 'Габапентин',
        value: 'Габапентин'
      },
      {
        label: 'Прегабалин',
        value: 'Прегабалин'
      },
      {
        label: 'Стирипентол',
        value: 'Стирипентол'
      },
      {
        label: 'Фенитоин',
        value: 'Фенитоин'
      },
      {
        label: 'Другое',
        value: 'Другое',
        isOther: true
      }
    ]
  },
  /*
  {
    name: "followValproates",
    label: "Вальпроаты",
    type: "checkbox",
    boxes:[
      {
        label: "Депакин сироп",
        name: "Послед Депакин сироп",
      },
      {
        label: "Депакин хроно",
        name: "Послед терапия Депакин хроно",
      },
      {
        label: "Депакин хроносфера",
        name: "Послед терапия Депакин хроносфера",
      },
      {
        label: "Энкорат хроно",
        name: "Послед терапия Энкорат хроно",
      },
      {
        label: "Дивальпроекс",
        name: "Послед терапия Дивальпроекс",
      },
      {
        label: "Депакоте",
        name: "Послед терапия Депакоте",
      },
    ]
  },
  {
    name: "followValproateAcid",
    label: "Вальпроевая кислота",
    type: "checkbox",
    boxes:[
      {
        label: "Конвулекс сироп/капли",
        name: "Послед Конвулекс сироп/капли",
      },
      {
        label: "Конвулекс в/в",
        name: "Послед Конвулекс в/в",
      },
      {
        label: "Конвулекс таблетка/капсула",
        name: "Послед Конвулекс таблетка/капсула",
      },
      {
        label: "Вальпрокс",
        name: "Послед Вальпрокс",
      },
    ]
  },
  {
    name: "followKarbamazepin",
    label: "Карбамазепин",
    type: "checkbox",
    boxes:[
      {
        label: "Финлепсин",
        name: "Послед Финлепсин",
      },
      {
        label: "Финлепсин ретард",
        name: "Послед Финлепсин ретард",
      },
      {
        label: "Карбалекс",
        name: "Послед Карбалекс",
      },
      {
        label: "Зептол",
        name: "Послед Зептол",
      },
      {
        label:"Тегретол",
        name:"Послед Тегретол",
      },
      {
        label:"Мезакар СР",
        name:"Послед Мезакар СР",
      },
      {
        label:"Другое",
        name:"Другое Карбамазепин"
      }
    ]
  },
  {
    name: "followLamotridjin",
    label: "Ламотриджин",
    type: "checkbox",
    boxes:[
      {
        label: "Ламиктал",
        name: "Послед Ламиктал",
      },
      {
        label: "Риджинол",
        name: "Послед Риджинол",
      },
      {
        label: "Ламотрикс",
        name: "Послед Ламотрикс",
      },
      {
        label: "Риджинол",
        name: "ПоследРиджинол",
      },
      {
        label:"Ламолеп",
        name:"Послед Ламолеп",
      },
      {
        label:"Ламитор",
        name:"Послед Ламитор",
      },
      {
        label:"Другое",
        name:"Другое Ламотриджин"
      }
    ]
  },
  {
    name: "followLevetiracetam",
    label: "Леветирацетам",
    type: "checkbox",
    boxes:[
      {
        label: "Кеппра сироп",
        name: "Послед Кеппра сироп",
      },
      {
        label: "Кеппра таблетка",
        name: "Послед Кеппра таблетка",
      },
      {
        label: "Эпикс",
        name: "Послед Эпикс",
      },
      {
        label: "Леветирацетам Тева",
        name: "Послед Леветирацетам Тева",
      },
      {
        label:"Эвалеп",
        name:"Послед Эвалеп",
      },
      {
        label:"Другое",
        name:"Другое Леветирацетам"
      }
    ]
  },
  {
    name: "followTopiromat",
    label: "Топиромат",
    type: "checkbox",
    boxes:[
      {
        label: "Топамакс",
        name: "Послед Топамакс",
      },
      {
        label: "Топивитэ",
        name: "Послед Топивитэ",
      },
      {
        label: "Топирол",
        name: "Послед Топирол",
      },
      {
        label: "Эпирамат Тева",
        name: "Послед Эпирамат Тева",
      },
      {
        label:"Другое",
        name:"Другое Топиромат"
      }
    ]
  },
  {
    name: "followOkskarbazepin",
    label: "Окскарбазепин",
    type: "checkbox",
    boxes:[
      {
        label: "Оксапин",
        name: "Послед Оксапин",
      },
      {
        label: "Трилептал",
        name: "Послед Трилептал",
      },
    ]
  },
  {
    name: "followFenobarbital",
    label: "Фенобарбитал",
    type: "checkbox",
    boxes:[
      {
        label: "Бензонал",
        name: "Послед Бензонал",
      },
      {
        label: "Люминал",
        name: "Послед Люминал",
      },
      {
        label: "Фенобарбитал",
        name: "Послед Фенобарбитал",
      },
      {
        label:"Другое",
        name:"Другое Фенобарбитал"
      }
    ]
  },
  {
    name: "vigabatrin",
    label: "Вигабатрин ",
    type: "checkbox",
    boxes:[
      {
        label: "Сабрил",
        name: "Послед Сабрил",
      },
      {
        label: "Кабрил",
        name: "Послед Кабрил",
      }, 
      {
        label:"Другое",
        name:"Другое Вигабатрин "
      }
    ]
  },
  {
    name: "etosuksimid",
    label: "Этосуксимид",
    type: "checkbox",
    boxes:[
      {
        label: "Петнидан",
        name: "Послед Петнидан",
      },
      {
        label: "Суксилеп",
        name: "Послед Суксилеп",
      }, 
      {
        label:"Другое",
        name:"Другое Этосуксимид  "
      }
    ]
  },
  {
    name: "perampanel",
    label: "Перампанел",
    type: "checkbox",
    boxes:[
      {
        label: "Файкомпа",
        name: "Послед Файкомпа",
      },
    ]
  },
  {
    name: "aktg",
    label: "АКТГ",
    type: "checkbox",
    boxes:[
      {
        label: "Синактен депо",
        name: "Послед Синактен депо",
      },
    ]
  },
  {
    name: "gidrokortizon",
    label: "Гидрокортизон",
    type: "checkbox",
    boxes:[
      {
        label: "Кортеф",
        name: "Послед Кортеф",
      },
    ]
  },
  {
    name: "zonisamid",
    label: "Зонисамид",
    type: "checkbox",
    boxes:[
      {
        label: "Зонегран",
        name: "Послед Зонегран",
      },
      {
        label: "Зоресан",
        name: "Послед Зоресан",
      },
    ]
  },
  {
    name: "lakosamid",
    label: "Лакосамид",
    type: "checkbox",
    boxes:[
      {
        label: "Вимпат",
        name: "Послед Вимпат",
      },
      {
        label: "Лакозам",
        name: "Послед Лакозам",
      },
      {
        label: "Другое",
        name: "Другое Лакосамид",
      },
    ]
  },
  {
    name: "sultiam",
    label: "Сультиам",
    type: "checkbox",
    boxes:[
      {
        label: "Осполот",
        name: "Послед Осполот",
      },
    ]
  },
  {
    name: "rufinamid",
    label: "Руфинамид",
    type: "checkbox",
    boxes:[
      {
        label: "Иновелон",
        name: "Послед Иновелон",
      },
    ]
  },
  {
    name: "klonazepam",
    label: "Клоназепам",
    type: "checkbox",
    boxes:[
      {
        label: "",
        name: "",
      },
    ]
  },
  {
    name: "klobazam",
    label: "Клобазам",
    type: "checkbox",
    boxes:[
      {
        label: "Фризиум",
        name: "Послед Фризиум",
      },
    ]
  },
  {
    name: "diazepam",
    label: "Диазепам",
    type: "checkbox",
    boxes:[
      {
        label: "Аналоги",
        name: "Аналоги Диазепам",
      },
    ]
  },
  {
    name: "gabapentin",
    label: "Габапентин",
    type: "checkbox",
    boxes:[
      {
        label: "Аналоги",
        name: "Аналоги Габапентин",
      },
    ]
  },
  {
    name: "pregabalin",
    label: "Прегабалин",
    type: "checkbox",
    boxes:[
      {
        label: "Аналоги",
        name: "Аналоги Прегабалин",
      },
    ]
  },
  {
    name: "stiripentol",
    label: "Стирипентол",
    type: "checkbox",
    boxes:[
      {
        label: "",
        name: "Стирипентол",
      },
    ]
  },
  {
    name: "fenitoin",
    label: "Фенитоин",
    type: "checkbox",
    boxes:[
      {
        label: "",
        name: "Фенитоин",
      },
    ]
  },
  {
    name: "otherPreparates",
    label: "Другие препараты",
    type: "checkbox",
    boxes:[
      {
        label: "",
        name: "Другие препараты",
      },
    ]
  },
  */

  //ТЕКУЩАЯ ТЕРАПИЯ
  {
    name: 'currentTherapy',
    label: 'Текущая терапия',
    type: 'options',
    options: [
      {
        label: 'Вальпроаты',
        value: 'Вальпроаты'
      },
      {
        label: 'Вальпроевая кислота',
        value: 'Вальпроевая кислота'
      },
      {
        label: 'Карбамазепин',
        value: 'Карбамазепин'
      },
      {
        label: 'Ламотриджин',
        value: 'Ламотриджин'
      },
      {
        label: 'Леветирацетам',
        value: 'Леветирацетам'
      },
      {
        label: 'Топиромат',
        value: 'Топиромат'
      },
      {
        label: 'Окскарбазепин',
        value: 'Окскарбазепин'
      },
      {
        label: 'Фенобарбитал',
        value: 'Фенобарбитал'
      },
      {
        label: 'Вигабатрин',
        value: 'Вигабатрин'
      },
      {
        label: 'Этосуксимид',
        value: 'Этосуксимид'
      },
      {
        label: 'Перампанел',
        value: 'Перампанел'
      },
      {
        label: 'АКТГ',
        value: 'АКТГ'
      },
      {
        label: 'Гидрокортизон',
        value: 'Гидрокортизон'
      },
      {
        label: 'Зонисамид',
        value: 'Зонисамид'
      },
      {
        label: 'Лакосамид',
        value: 'Лакосамид'
      },
      {
        label: 'Сультиам',
        value: 'Сультиам'
      },
      {
        label: 'Руфинамид',
        value: 'Руфинамид'
      },
      {
        label: 'Клоназепам',
        value: 'Клоназепам'
      },
      {
        label: 'Клобазам',
        value: 'Клобазам'
      },
      {
        label: 'Диазепам',
        value: 'Диазепам'
      },
      {
        label: 'Габапентин',
        value: 'Габапентин'
      },
      {
        label: 'Прегабалин',
        value: 'Прегабалин'
      },
      {
        label: 'Стирипентол',
        value: 'Стирипентол'
      },
      {
        label: 'Фенитоин',
        value: 'Фенитоин'
      },
      {
        label: 'Другое',
        value: 'Другое',
        isOther: true
      }
    ]
  },

  {
    name: 'healTypes',
    label: 'Типы лечения:',
    type: 'options',
    options: [
      {
        label: 'монотерапия',
        value: 'монотерапия'
      },
      {
        label: 'битерапия',
        value: 'битерапия'
      },
      {
        label: 'политерапия',
        value: 'политерапия'
      }
    ]
  },
  {
    name: 'effectivenessGrade',
    label: 'Оценка эффективности:',
    type: 'options',
    options: [
      {
        label: 'частые приступы (приступы раз в 1-3 мес)',
        value: 'частые приступы (приступы раз в 1-3 мес)'
      },
      {
        label: 'редкие приступы (раз в 3-9 мес)',
        value: 'редкие приступы (раз в 3-9 мес)'
      },
      {
        label: 'ремиссия (12 мес и более нет приступов)',
        value: 'ремиссия (12 мес и более нет приступов)'
      },
      {
        label:
          'стадия разрешения (после отмены препаратов приступы не повторились)',
        value:
          'стадия разрешения (после отмены препаратов приступы не повторились)'
      }
    ]
  }
]

const formFieldInstrumentalResearch: FormField[] = [
  {
    name: 'typesOfEEG',
    label: 'Виды ЭЭГ',
    type: 'options',
    options: [
      {
        label: 'рутинная',
        value: 'рутинная'
      },
      {
        label: 'амбулаторная (от 1 до 12 часов)',
        value: 'амбулаторная (от 1 до 12 часов)'
      },
      {
        label: 'длительная ЭЭГ (от 12 ч до несколько дней)',
        value: 'длительная ЭЭГ (от 12 ч до несколько дней)'
      }
    ]
  },
  {
    name: 'resultOfInterictalEEG',
    label: 'Результат интериктального ЭЭГ',
    type: 'multioptions',
    options: [
      {
        label: 'норма',
        value: 'норма'
      },
      {
        label: 'патологический',
        value: 'патологический',
        options: [
          {
            label: 'специфические',
            value: 'специфические',
            options: [
              {
                label: 'острая/спайк волна',
                value: 'острая/спайк волна',
                options: [
                  {
                    label: 'справа',
                    value: 'справа',
                    isCheckbox: true,
                    options: [
                      {
                        label: 'Лобная',
                        value: 'Лобная'
                      },
                      {
                        label: 'Центральная',
                        value: 'Центральная'
                      },
                      {
                        label: 'Теменная',
                        value: 'Теменная'
                      },
                      {
                        label: 'Затылочная',
                        value: 'Затылочная'
                      },
                      {
                        label: 'Височная',
                        value: 'Височная'
                      },
                      {
                        label: 'Комбинированный',
                        value: 'Комбинированный'
                      }
                    ]
                  },
                  {
                    label: 'слева',
                    value: 'слева',
                    isCheckbox: true,
                    options: [
                      {
                        label: 'Лобная',
                        value: 'Лобная'
                      },
                      {
                        label: 'Центральная',
                        value: 'Центральная'
                      },
                      {
                        label: 'Теменная',
                        value: 'Теменная'
                      },
                      {
                        label: 'Затылочная',
                        value: 'Затылочная'
                      },
                      {
                        label: 'Височная',
                        value: 'Височная'
                      },
                      {
                        label: 'Комбинированный',
                        value: 'Комбинированный'
                      }
                    ]
                  },
                  {
                    label: 'билатерально',
                    value: 'билатерально',
                    isCheckbox: true,
                    options: [
                      {
                        label: 'Лобная',
                        value: 'Лобная'
                      },
                      {
                        label: 'Центральная',
                        value: 'Центральная'
                      },
                      {
                        label: 'Теменная',
                        value: 'Теменная'
                      },
                      {
                        label: 'Затылочная',
                        value: 'Затылочная'
                      },
                      {
                        label: 'Височная',
                        value: 'Височная'
                      },
                      {
                        label: 'Комбинированный',
                        value: 'Комбинированный'
                      }
                    ]
                  }
                ]
              },
              {
                label: 'спайк/острая-медленная волна',
                value: 'спайк/острая-медленная волна',
                options: [
                  {
                    label: 'справа',
                    value: 'справа',
                    isCheckbox: true,
                    options: [
                      {
                        label: 'Лобная',
                        value: 'Лобная'
                      },
                      {
                        label: 'Центральная',
                        value: 'Центральная'
                      },
                      {
                        label: 'Теменная',
                        value: 'Теменная'
                      },
                      {
                        label: 'Затылочная',
                        value: 'Затылочная'
                      },
                      {
                        label: 'Височная',
                        value: 'Височная'
                      },
                      {
                        label: 'Комбинированный',
                        value: 'Комбинированный'
                      }
                    ]
                  },
                  {
                    label: 'слева',
                    value: 'слева',
                    isCheckbox: true,
                    options: [
                      {
                        label: 'Лобная',
                        value: 'Лобная'
                      },
                      {
                        label: 'Центральная',
                        value: 'Центральная'
                      },
                      {
                        label: 'Теменная',
                        value: 'Теменная'
                      },
                      {
                        label: 'Затылочная',
                        value: 'Затылочная'
                      },
                      {
                        label: 'Височная',
                        value: 'Височная'
                      },
                      {
                        label: 'Комбинированный',
                        value: 'Комбинированный'
                      }
                    ]
                  },
                  {
                    label: 'билатерально',
                    value: 'билатерально',
                    isCheckbox: true,
                    options: [
                      {
                        label: 'Лобная',
                        value: 'Лобная'
                      },
                      {
                        label: 'Центральная',
                        value: 'Центральная'
                      },
                      {
                        label: 'Теменная',
                        value: 'Теменная'
                      },
                      {
                        label: 'Затылочная',
                        value: 'Затылочная'
                      },
                      {
                        label: 'Височная',
                        value: 'Височная'
                      },
                      {
                        label: 'Комбинированный',
                        value: 'Комбинированный'
                      }
                    ]
                  }
                ]
              },
              {
                label: 'генерализованная спайк-медленная волна 3-4 Гц',
                value: 'генерализованная спайк-медленная волна 3-4 Гц'
              },
              {
                label: 'генерализованная спайк-медленная волна 4-6 Гц',
                value: 'генерализованная спайк-медленная волна 4-6 Гц'
              },
              {
                label: 'генерализованная спайк-медленная волна <3 Гц',
                value: 'генерализованная спайк-медленная волна <3 Гц'
              },
              {
                label: 'генерализованная полиспайк-медленная волна',
                value: 'генерализованная полиспайк-медленная волна'
              },
              {
                label:
                  'латерализованная эпилептиформная активность (справа или слева)',
                value:
                  'латерализованная эпилептиформная активность (справа или слева)'
              },
              {
                label: 'фотопароксизмальный ответ – тип 1, тип 2, тип 3, тип 4',
                value: 'фотопароксизмальный ответ – тип 1, тип 2, тип 3, тип 4'
              },
              {
                label: 'вторичная генерализованная эпилептиформная активность',
                value: 'вторичная генерализованная эпилептиформная активность'
              },
              {
                label:
                  'эпилептическая энцефалопатия с непрерывной спайк-волновой активностью во время сна (CSWS)',
                value:
                  'эпилептическая энцефалопатия с непрерывной спайк-волновой активностью во время сна (CSWS)'
              },
              {
                label: 'центро-темпоральные спайки',
                value: 'центро-темпоральные спайки'
              }
            ]
          },
          {
            label: 'неспецифические',
            value: 'неспецифические',
            options: [
              {
                label: 'региональная полиморфная тета-дельта активность',
                value: 'региональная полиморфная тета-дельта активность',
                options: [
                  {
                    label: 'непрерывная',
                    value: 'непрерывная',
                    options: [
                      {
                        label: 'справа',
                        value: 'справа',
                        isCheckbox: true,
                        options: [
                          {
                            label: 'Лобная',
                            value: 'Лобная'
                          },
                          {
                            label: 'Центральная',
                            value: 'Центральная'
                          },
                          {
                            label: 'Теменная',
                            value: 'Теменная'
                          },
                          {
                            label: 'Затылочная',
                            value: 'Затылочная'
                          },
                          {
                            label: 'Височная',
                            value: 'Височная'
                          },
                          {
                            label: 'Комбинированный',
                            value: 'Комбинированный'
                          }
                        ]
                      },
                      {
                        label: 'слева',
                        value: 'слева',
                        isCheckbox: true,
                        options: [
                          {
                            label: 'Лобная',
                            value: 'Лобная'
                          },
                          {
                            label: 'Центральная',
                            value: 'Центральная'
                          },
                          {
                            label: 'Теменная',
                            value: 'Теменная'
                          },
                          {
                            label: 'Затылочная',
                            value: 'Затылочная'
                          },
                          {
                            label: 'Височная',
                            value: 'Височная'
                          },
                          {
                            label: 'Комбинированный',
                            value: 'Комбинированный'
                          }
                        ]
                      },
                      {
                        label: 'билатерально',
                        value: 'билатерально',
                        isCheckbox: true,
                        options: [
                          {
                            label: 'Лобная',
                            value: 'Лобная'
                          },
                          {
                            label: 'Центральная',
                            value: 'Центральная'
                          },
                          {
                            label: 'Теменная',
                            value: 'Теменная'
                          },
                          {
                            label: 'Затылочная',
                            value: 'Затылочная'
                          },
                          {
                            label: 'Височная',
                            value: 'Височная'
                          },
                          {
                            label: 'Комбинированный',
                            value: 'Комбинированный'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    label: 'прерывистая',
                    value: 'прерывистая',
                    options: [
                      {
                        label: 'FIRDA',
                        value: 'FIRDA'
                      },
                      {
                        label: 'TIRDA',
                        value: 'TIRDA'
                      },
                      {
                        label: 'OIRDA',
                        value: 'OIRDA'
                      }
                    ]
                  }
                ]
              },
              {
                label: 'диффузная полиморфная тета-дельта активность',
                value: 'диффузная полиморфная тета-дельта активность'
              },
              {
                label: 'замедление фоновой активности',
                value: 'замедление фоновой активности'
              },
              {
                label: 'Трифазные волны',
                value: 'Трифазные волны'
              },
              {
                label: 'Усиленная бета активность',
                value: 'Усиленная бета активность'
              },
              {
                label: 'SREDA',
                value: 'SREDA'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'prevalence',
    label: 'Распространённость',
    type: 'label'
  },
  {
    name: 'prevalenceResultOfInterictalEEG',
    label: 'Результат иктального ЭЭГ',
    type: 'multioptions',
    options: [
      {
        label: 'Не инвазивный',
        value: 'Не инвазивный'
      },
      {
        label: 'Инвазивный',
        value: 'Инвазивный',
        options: [
          {
            label: 'Кортикография',
            value: 'Кортикография'
          },
          {
            label: 'Стерео ЭЭГ',
            value: 'Стерео ЭЭГ'
          }
        ]
      }
    ]
  },
  {
    name: 'localization',
    label: 'Локализация',
    type: 'multioptions',
    options: [
      {
        label: 'локализация',
        value: 'локализация',
        isCheckbox: true,
        options: [
          {
            label: '1',
            value: '1',
            options: [
              {
                label: 'Лобная',
                value: 'Лобная'
              },
              {
                label: 'лобно-полюсная',
                value: 'лобно-полюсная'
              },
              {
                label: 'лобно-центральный',
                value: 'лобно-центральный'
              },
              {
                label: 'лобно-сагиттальный',
                value: 'лобно-сагиттальный'
              },
              {
                label: 'лобно-латеральный',
                value: 'лобно-латеральный'
              },
              {
                label: 'лобно-височный',
                value: 'лобно-височный'
              }
            ]
          },
          {
            label: '2',
            value: '2',
            options: [
              {
                label: 'Центральный',
                value: 'Центральный'
              },
              {
                label: 'Центрально-сагиттальный',
                value: 'Центрально-сагиттальный'
              }
            ]
          },
          {
            label: '3',
            value: '3',
            options: [
              {
                label: 'теменная',
                value: 'теменная'
              },
              {
                label: 'теменно-сагиттальный',
                value: 'теменно-сагиттальный'
              },
              {
                label: 'теменно-затылочный',
                value: 'теменно-затылочный'
              }
            ]
          },
          {
            label: '4',
            value: '4',
            options: [
              {
                label: 'затылочный',
                value: 'затылочный'
              }
            ]
          },
          {
            label: '5',
            value: '5',
            options: [
              {
                label: 'Височный',
                value: 'Височный'
              },
              {
                label: 'Передневисочный',
                value: 'Передневисочный'
              },
              {
                label: 'Средневисочный',
                value: 'Средневисочный'
              },
              {
                label: 'Теменно-височный',
                value: 'Теменно-височный'
              },
              {
                label: 'Затылочно-височный',
                value: 'Затылочно-височный'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'types',
    label: 'Типы',
    type: 'options',
    options: [
      {
        label: 'Ритмичное развитие тета-, дельта-, альфа-частот',
        value: 'Ритмичное развитие тета-, дельта-, альфа-частот'
      },
      {
        label: 'Ритмичные спайки',
        value: 'Ритмичные спайки'
      },
      {
        label: 'Спайк-медленная волна',
        value: 'Спайк-медленная волна'
      },
      {
        label:
          'Электродекрементный (низкоамплитудная, высокочастотная активность)',
        value:
          'Электродекрементный (низкоамплитудная, высокочастотная активность)'
      },
      {
        label:
          'Клинический эпилептический приступ, но без четких изменений на ЭЭГ',
        value:
          'Клинический эпилептический приступ, но без четких изменений на ЭЭГ'
      }
    ]
  },
  {
    name: 'lateralization',
    label: 'Латерализация',
    type: 'options',
    options: [
      {
        label: 'справа',
        value: 'справа'
      },
      {
        label: 'слева',
        value: 'слева'
      },
      {
        label: 'билатеральный',
        value: 'билатеральный'
      },
      {
        label: 'сагиттальный',
        value: 'сагиттальный'
      },
      {
        label: 'не выполнено',
        value: 'не выполнено'
      }
    ]
  }
]

const formFieldMRIResult: FormField[] = [
  {
    name: 'localizationnMRI',
    label: 'Локализация',
    type: 'multioptions',
    options: [
      {
        label: 'Лобная доля',
        value: 'Лобная доля',
        isCheckbox: true,
        options: [
          {
            label: 'поясная извилина',
            value: 'поясная извилина'
          },
          {
            label: 'лобная оперкулуярная изв',
            value: 'лобная оперкулуярная изв'
          },
          {
            label: 'лобно-полюсная изв',
            value: 'лобно-полюсная изв'
          },
          {
            label: 'нижняя лобная изв',
            value: 'нижняя лобная изв'
          },
          {
            label: 'средняя лобная изв',
            value: 'средняя лобная изв'
          },
          {
            label: 'верхняя лобная изв',
            value: 'верхняя лобная изв'
          },
          {
            label: 'медиальная лобная изв',
            value: 'медиальная лобная изв'
          },
          {
            label: 'орбитофронтальная извилина',
            value: 'орбитофронтальная извилина'
          },
          {
            label: 'прецентральная извилина',
            value: 'прецентральная извилина'
          },
          {
            label: 'лобно-височная изв',
            value: 'лобно-височная изв'
          },
          {
            label: 'белое вещество – лобная',
            value: 'белое вещество – лобная'
          },
          {
            label: 'лобно-теменная изв',
            value: 'лобно-теменная изв'
          }
        ]
      },
      {
        label: 'Височная доля',
        value: 'Височная доля',
        isCheckbox: true,
        options: [
          {
            label: 'амигдала/гиппокамп',
            value: 'амигдала/гиппокамп'
          },
          {
            label: 'нижняя височная изв',
            value: 'нижняя височная изв'
          },
          {
            label: 'средняя височная изв',
            value: 'средняя височная изв'
          },
          {
            label: 'верхняя височная изв',
            value: 'верхняя височная изв'
          },
          {
            label: 'крючок',
            value: 'крючок'
          },
          {
            label: 'парагиппокампальная изв',
            value: 'парагиппокампальная изв'
          },
          {
            label: 'височная оперкулярная изв',
            value: 'височная оперкулярная изв'
          },
          {
            label: 'поперечная височная изв',
            value: 'поперечная височная изв'
          },
          {
            label: 'височно-затылочная изв',
            value: 'височно-затылочная изв'
          },
          {
            label: 'височно-теменная изв',
            value: 'височно-теменная изв'
          },
          {
            label: 'белое вещество височной доли',
            value: 'белое вещество височной доли'
          }
        ]
      },
      {
        label: 'Теменная доля',
        value: 'Теменная доля',
        isCheckbox: true,
        options: [
          {
            label: 'нижняя теменная доля',
            value: 'нижняя теменная доля'
          },
          {
            label: 'теменная оперкулярная изв',
            value: 'теменная оперкулярная изв'
          },
          {
            label: 'супрамаргинальная изв',
            value: 'супрамаргинальная изв'
          },
          {
            label: 'угловая извилина',
            value: 'угловая извилина'
          },
          {
            label: 'постцентральная изв',
            value: 'постцентральная изв'
          },
          {
            label: 'парацентральная доля',
            value: 'парацентральная доля'
          },
          {
            label: 'предклинье',
            value: 'предклинье'
          },
          {
            label: 'теменно-затылочная изв',
            value: 'теменно-затылочная изв'
          },
          {
            label: 'верхняя теменная доля',
            value: 'верхняя теменная доля'
          },
          {
            label: 'белое вещество теменной доли',
            value: 'белое вещество теменной доли'
          },
          {
            label: '',
            value: ''
          }
        ]
      },
      {
        label: 'Затылочная доля',
        value: 'Затылочная доля',
        isCheckbox: true,
        options: [
          {
            label: 'клин',
            value: 'клин'
          },
          {
            label: 'латеральная затылочная изв',
            value: 'латеральная затылочная изв'
          },
          {
            label: 'лингвальная изв',
            value: 'лингвальная изв'
          },
          {
            label: 'затылочный полюс',
            value: 'затылочный полюс'
          },
          {
            label: 'верхняя затылочная изв',
            value: 'верхняя затылочная изв'
          },
          {
            label: 'белое вещество затылочной доли',
            value: 'белое вещество затылочной доли'
          }
        ]
      },
      {
        label: 'Инсула',
        value: 'Инсула'
      },
      {
        label: 'Базальные ганглии',
        value: 'Базальные ганглии'
      },
      {
        label: 'Внутрижелудочковые/перивентрикулярные',
        value: 'Внутрижелудочковые/перивентрикулярные'
      },
      {
        label: 'Мозжечок',
        value: 'Мозжечок'
      },
      {
        label: 'Ствол мозга',
        value: 'Ствол мозга'
      },
      {
        label: 'Полушария г/м',
        value: 'Полушария г/м'
      },
      {
        label: 'Мозолистое тело',
        value: 'Мозолистое тело'
      },
      {
        label: 'Множественные узлы (больше 2х)',
        value: 'Множественные узлы (больше 2х)'
      },
      {
        label: 'Без патологии',
        value: 'Без патологии'
      }
    ]
  },
  {
    name: 'lateralizationMRI',
    label: 'Латерализация',
    type: 'options',
    options: [
      {
        label: 'справа',
        value: 'справа'
      },
      {
        label: 'слева',
        value: 'слева'
      },
      {
        label: 'билатеральный',
        value: 'билатеральный'
      },
      {
        label: 'сагиттальный',
        value: 'сагиттальный'
      },
      {
        label: 'не выполнено',
        value: 'не выполнено'
      }
    ]
  },
  {
    name: 'diagnosisMRI',
    label: 'Диагноз по МРТ',
    type: 'multioptions',
    options: [
      {
        label: 'Сосудистая мальформация',
        value: 'Сосудистая мальформация',
        options: [
          {
            label: 'АВМ',
            value: 'АВМ'
          },
          {
            label: 'кавернозная ангиома',
            value: 'кавернозная ангиома'
          },
          {
            label: 'врожденная венозная аномалия',
            value: 'врожденная венозная аномалия'
          }
        ]
      },
      {
        label: 'После энцефалита (простой герпес)',
        value: 'После энцефалита (простой герпес)'
      },
      {
        label: 'Туберозный склероз',
        value: 'Туберозный склероз',
        options: [
          {
            label: 'кортикальные туберсы или гамартомы',
            value: 'кортикальные туберсы или гамартомы'
          },
          {
            label: 'туберозный склероз',
            value: 'туберозный склероз'
          },
          {
            label: 'нарушения в белом веществе',
            value: 'нарушения в белом веществе'
          },
          {
            label: 'субэпендимальная гигантоклеточная астроцитома',
            value: 'субэпендимальная гигантоклеточная астроцитома'
          }
        ]
      },
      {
        label: 'Церебральная кортикальная дизгенезия',
        value: 'Церебральная кортикальная дизгенезия',
        options: [
          {
            label: 'ФКД',
            value: 'ФКД'
          },
          {
            label: 'гемимегалэнцефалия',
            value: 'гемимегалэнцефалия'
          },
          {
            label: 'фокальная субкортикальная гетеротопия',
            value: 'фокальная субкортикальная гетеротопия'
          },
          {
            label: 'полимикрогирия',
            value: 'полимикрогирия'
          },
          {
            label: 'лизэнцефалия',
            value: 'лизэнцефалия'
          },
          {
            label: 'субэпендимальная гетеротопия',
            value: 'субэпендимальная гетеротопия'
          },
          {
            label: 'пахигирия',
            value: 'пахигирия'
          },
          {
            label: 'шизэнцефалия',
            value: 'шизэнцефалия'
          },
          {
            label: 'синдром двойной коры г/м',
            value: 'синдром двойной коры г/м'
          },
          {
            label: 'гетеротопия',
            value: 'гетеротопия'
          }
        ]
      },
      {
        label: 'Киста',
        value: 'Киста',
        options: [
          {
            label: 'арахноидальная киста',
            value: 'арахноидальная киста'
          },
          {
            label: 'порэнцефалическая киста',
            value: 'порэнцефалическая киста'
          },
          {
            label: 'киста',
            value: 'киста'
          }
        ]
      },
      {
        label: 'Энцефаломаляция',
        value: 'Энцефаломаляция',
        options: [
          {
            label: 'постаноксическая',
            value: 'постаноксическая'
          },
          {
            label: 'пострадиационная',
            value: 'пострадиационная'
          },
          {
            label: 'посттравматическая',
            value: 'посттравматическая'
          },
          {
            label: 'энцефаломаляция',
            value: 'энцефаломаляция'
          },
          {
            label: 'отделенные инфаркты',
            value: 'отделенные инфаркты'
          }
        ]
      },
      {
        label: 'Атрофия',
        value: 'Атрофия',
        options: [
          {
            label: 'атрофия',
            value: 'атрофия'
          },
          {
            label: 'глиозы',
            value: 'глиозы'
          }
        ]
      },
      {
        label: 'Пространственно-занимающее поражение',
        value: 'Пространственно-занимающее поражение',
        options: [
          {
            label: 'опухоли (первичная)',
            value: 'опухоли (первичная)'
          },
          {
            label: 'абсцесс',
            value: 'абсцесс'
          },
          {
            label: 'туберкулема',
            value: 'туберкулема'
          },
          {
            label: 'пространственно-занимающее поражение',
            value: 'пространственно-занимающее поражение'
          },
          {
            label: 'менингиома',
            value: 'менингиома'
          },
          {
            label: 'метастаз',
            value: 'метастаз'
          }
        ]
      },
      {
        label: 'Демиелинизация',
        value: 'Демиелинизация',
        options: [
          {
            label: 'демиелинизация',
            value: 'демиелинизация'
          },
          {
            label: 'гипомиелинизация',
            value: 'гипомиелинизация'
          }
        ]
      },
      {
        label: 'Агенизия мозолистое тело',
        value: 'Агенизия мозолистое тело'
      },
      {
        label: 'Гемангиома',
        value: 'Гемангиома'
      },
      {
        label: 'Эпендимома',
        value: 'Эпендимома'
      },
      {
        label: 'Мезиальный височный склероз (атрофия)',
        value: 'Мезиальный височный склероз (атрофия)'
      },
      {
        label: 'Внутричерепная кальцинация + атрофия',
        value: 'Внутричерепная кальцинация + атрофия'
      },
      {
        label: 'Норма',
        value: 'Норма'
      },
      {
        label: 'Гидроцефалия',
        value: 'Гидроцефалия '
      },
      {
        label: 'Резидуальные очаги',
        value: 'Резидуальные очаги'
      }
    ]
  }
]

const formFieldPETCTresult: FormField[] = [
  {
    name: 'localizationPETCT',
    label: 'Локализация',
    type: 'multioptions',
    options: [
      {
        label: 'височная доля',
        value: 'височная доля',
        options: [
          {
            label: 'передняя',
            value: 'передняя'
          },
          {
            label: 'медиальная',
            value: 'медиальная'
          },
          {
            label: 'латеральная',
            value: 'латеральная'
          }
        ]
      },
      {
        label: 'лобная доля',
        value: 'лобная доля'
      },
      {
        label: 'теменная доля',
        value: 'теменная доля'
      },
      {
        label: 'затылочная доля',
        value: 'затылочная доля'
      },
      {
        label: 'таламус',
        value: 'таламус'
      },
      {
        label: 'мозжечок',
        value: 'мозжечок'
      },
      {
        label: 'перивентрикулярная',
        value: 'перивентрикулярная'
      },
      {
        label: 'инсула',
        value: 'инсула'
      },
      {
        label: 'ствол мозга',
        value: 'ствол мозга'
      },
      {
        label: 'полушария г/м',
        value: 'полушария г/м'
      },
      {
        label: 'базальные ганглии',
        value: 'базальные ганглии'
      },
      {
        label: 'гипоталамус',
        value: 'гипоталамус'
      },
      {
        label: 'множественные узлы',
        value: 'множественные узлы'
      }
    ]
  },
  {
    name: 'lateralizationPETCT',
    label: 'Латерализация',
    type: 'options',
    options: [
      {
        label: 'справа',
        value: 'справа'
      },
      {
        label: 'слева',
        value: 'слева'
      },
      {
        label: 'билатеральный',
        value: 'билатеральный'
      },
      {
        label: 'сагиттальный',
        value: 'сагиттальный'
      },
      {
        label: 'не выполнено',
        value: 'не выполнено'
      }
    ]
  },
  {
    name: 'resultPETCT',
    label: 'Заключение',
    type: 'options',
    options: [
      {
        label: 'гиперметаболизм',
        value: 'гиперметаболизм'
      },
      {
        label: 'гипометаболизм',
        value: 'гипометаболизм'
      },
      {
        label: 'норма',
        value: 'норма'
      }
    ]
  }
]

const formSchema: FormField[][] = [
  formFieldsPassportData,
  formFieldsAnamnesisVitae,
  formFieldsAnamnesisEpilepsy,
  formFieldActualSituation,
  formFieldAnticonvulsantDrugs,
  formFieldInstrumentalResearch,
  formFieldMRIResult,
  formFieldPETCTresult
]
