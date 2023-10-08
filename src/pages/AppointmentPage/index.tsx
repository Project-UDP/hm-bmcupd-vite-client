import { ChangeEvent, useEffect, useState } from 'react'
import { DatePicker, Calendar, Badge, BadgeProps, CalendarProps } from 'antd'
import { Dayjs } from 'dayjs'
import type { DatePickerProps } from 'antd/es/date-picker'
import { Appointment } from '../../types/Appointment'
import { localStorageUtil } from '../../utils/localStorageUtils'
import { toastUtils } from '../../utils/toastUtils'
import { api } from '../../api/api'
import { objectUtils } from '../../utils/objectUtils'
import dayjs from 'dayjs'

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394
  }
} //TODO: depricated

export const AppointmentPage = (): JSX.Element => {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [appointmentForm, setAppointmentForm] = useState<Appointment>({
    dateTime: '',
    doctorId: 0,
    title: '',
    additionalInformation: '',
    phoneNumber: ''
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
  }
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => {
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const openAppointmentDetails = (appointment: Appointment) => {
    setAppointmentForm(appointment)
    openModal()
  }

  useEffect(() => {
    ;(async () => {
      const user = localStorageUtil.user.get()
      if (!user) {
        toastUtils.error('Пользователь не опознан')
        return
      }
      try {
        const result = await api.appointment.getByDoctor(user.id!)
        setAppointments(result.data)
      } catch (error) {
        toastUtils.error('Ошибка загрузки приемов')
        console.error(error)
      }
    })()
  }, [])

  // region: Calendar
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value)
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null
  }

  const dateCellRender = (value: Dayjs) => {
    const appointmentBullets: any = []
    appointments?.forEach((item) => {
      const date = dayjs(item.dateTime)
      const ifDatesCorrespounding =
        date.year() === value.year() &&
        date.month() === value.month() &&
        date.date() === value.date()
      if (ifDatesCorrespounding) {
        const key = item.id
        const time = date.format('HH:mm')
        appointmentBullets.push({
          key: key,
          type: 'warning',
          content: `${time} - ${item.title}`,
          item: item
        })
      }
    })

    return (
      <ul style={{ listStyle: 'none' }} className="events">
        {appointmentBullets.map((item: any) => (
          <li key={item.key} onClick={() => openAppointmentDetails(item.item)}>
            <Badge
              status={item.type as BadgeProps['status']}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    )
  }

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current)
    if (info.type === 'month') return monthCellRender(current)
    return info.originNode
  }
  // end region

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Записи на прием</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Записать
        </button>
        <br />
        <Calendar cellRender={cellRender} mode="month" />
        <AddAppointmentModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          setAppointments={setAppointments}
        />
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          appointment={appointmentForm}
          setAppointments={setAppointments}
        />
      </div>
    </>
  )
}

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  setAppointments: (appointments: Appointment[]) => void
}

const AddAppointmentModal = ({
  isOpen,
  onClose,
  setAppointments
}: AddAppointmentModalProps): JSX.Element => {
  const [appointmentForm, setAppointmentForm] = useState<Appointment>({
    dateTime: '',
    doctorId: 0,
    title: '',
    additionalInformation: '',
    phoneNumber: ''
  })

  console.log(Boolean(appointmentForm.dateTime))

  const handleModalClose = () => {
    setAppointmentForm({
      dateTime: '',
      doctorId: 0,
      title: '',
      additionalInformation: '',
      phoneNumber: ''
    })
    onClose()
  }

  const handleAddAppointment = async () => {
    const user = localStorageUtil.user.get()
    if (!user) {
      toastUtils.error('Пользователь не опознан')
      return
    }

    const newAppointment = objectUtils.deepCopy(appointmentForm)
    newAppointment.doctorId = user.id

    try {
      const r = await api.appointment.add(newAppointment)
      console.log(r)
      const result = await api.appointment.getByDoctor(user.id!)
      setAppointments(result.data)
      handleModalClose()
    } catch (error) {
      console.error(error)
    }
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name
    const value = event.target.value
    setAppointmentForm({ ...appointmentForm, [key]: value })
  }

  const onChange = (value: DatePickerProps['value'], dateString: string) => {
    setAppointmentForm({ ...appointmentForm, dateTime: dateString })
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <div className="modalling d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <input
              name="title"
              value={appointmentForm.title}
              onChange={handleInput}
              placeholder="ФИО"
              className="form-control mb-2"
              style={{ width: '100%' }}
            />
          </div>
          <div className="col-md-6">
            <input
              name="phoneNumber"
              value={appointmentForm.phoneNumber}
              onChange={handleInput}
              placeholder="Номер телефона"
              className="form-control mb-2"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <input
              name="additionalInformation"
              value={appointmentForm.additionalInformation}
              onChange={handleInput}
              placeholder="Дополнительная информация"
              className="form-control mb-2"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <DatePicker
              showTime
              onChange={onChange}
              className="mb-2"
              style={{ width: '100%' }}
            />
          </div>
          <div className="col-md-6">
            <button
              disabled={!appointmentForm.dateTime || !appointmentForm.title}
              onClick={handleAddAppointment}
              className="btn btn-primary mb-2"
              style={{ width: '100%' }}
            >
              Добавить
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <button
              onClick={handleModalClose}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AppointmentModalProp {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment
  setAppointments: (appointments: Appointment[]) => void
}

const AppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  setAppointments
}: AppointmentModalProp): JSX.Element => {
  const handleAppointmentRemove = async () => {
    try {
      await api.appointment.remove(appointment.id!)
    } catch (error) {
      console.error(error)
      toastUtils.error('Не удалось удалить прием')
      return
    }

    const user = localStorageUtil.user.get()
    if (!user) {
      toastUtils.error('Пользователь не опознан')
      return
    }

    try {
      const result = await api.appointment.getByDoctor(user.id!)
      setAppointments(result.data)
    } catch (error) {
      console.error(error)
      toastUtils.error('Ошибка загрузки приемов')
    }
    onClose()
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <div className="modalling d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="text-center">
          <div className="form-group border rounded p-1">
            <label htmlFor="title" className="mb-2">
              <h5>ФИО:</h5>
            </label>
            <p className="mb-4">{appointment.title}</p>
          </div>
          <div className="form-group border rounded p-1">
            <label htmlFor="phoneNumber" className="mb-2">
              <h5>Номер телефона:</h5>
            </label>
            <p className="mb-4">{appointment.phoneNumber}</p>
          </div>
          <div className="form-group border rounded p-1">
            <label htmlFor="dateTime" className="mb-2">
              <h5>Дата и время:</h5>
            </label>
            <p className="mb-4">{appointment.dateTime}</p>
          </div>
          <div className="form-group border rounded p-2">
            <label htmlFor="additionalInformation" className="mb-2">
              <h5>Дополнительная информация:</h5>
            </label>
            <p className="mb-4">{appointment.additionalInformation}</p>
          </div>
          <button onClick={onClose} className="btn btn-secondary mr-2">
            Закрыть
          </button>
          <button onClick={handleAppointmentRemove} className="btn btn-danger">
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
