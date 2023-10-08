import { useNavigate } from 'react-router-dom'
import { Patient } from '../../../types/Patient'

interface Props {
  patient: Patient
}

export const PatientCard = ({ patient }: Props): JSX.Element => {
  const navigate = useNavigate()

  const handlePatientRedirect = () => {
    navigate(`/patient`, { state: patient })
  }

  return (
    <div
      className="profile-block col-md-12 col-lg-5 mx-3 my-3 pt-2"
      style={{
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      onClick={() => handlePatientRedirect()}
    >
      <h3>
        {`${patient.secondName} ${patient.firstName} ${patient.patronymic}`}
      </h3>
      <p style={{ display: 'inline-block' }}>
        <strong>ИИН:</strong> {patient.iin}
      </p>
      <p style={{ display: 'inline-block', marginLeft: '10px' }}>
        <strong>Пол:</strong> {patient.isMale ? 'Мужчина' : 'Женщина'}
      </p>
      <p>
        <strong>Дата Рождения:</strong> {patient.dateOfBirth?.toString()}{' '}
        {/* TODO: convert to readable */}
      </p>
      <p>
        <strong>ID № (Номер регистрации):</strong> {patient.registrationNumber}
      </p>
      <p>
        <strong>МКБ-10:</strong> {patient.icd || 'Не указано'}
      </p>
      <p>
        <strong>Тип эпилепсии:</strong> {patient.epilepsyType || 'Не указано'}
      </p>
    </div>
  )
}
