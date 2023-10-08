import { DatePicker } from 'antd'
import { FilterParam } from './FilterCard'
import { usePatient } from '../../../hooks/usePatient'
import { FilterParameters } from '../../../types/FilterParameters'

const { RangePicker } = DatePicker

interface Props {
  parameter: FilterParam
}

export const FilterParameter = ({ parameter }: Props): JSX.Element => {
  const { filterParameters, handleFilterParametersChange } = usePatient()

  switch (parameter.type) {
    case 'radio':
      return (
        <div
          className="filter"
          style={{ borderBottom: '1px solid rgba(0,0,0,.08)' }}
        >
          <div className="filter__title">{parameter.title}</div>

          {parameter.options?.map((option) => {
            return (
              <div className="form-check" key={option.value}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={parameter.name as string}
                  value={option.value}
                  checked={
                    filterParameters[
                      parameter.name as keyof FilterParameters
                    ] === option.value
                  }
                  onChange={handleFilterParametersChange}
                />
                <label className="form-check-label" htmlFor="any">
                  {option.label}
                </label>
              </div>
            )
          })}
        </div>
      )
    case 'date-range':
      return (
        <div
          className="filter"
          style={{ borderBottom: '1px solid rgba(0,0,0,.08)' }}
        >
          <div className="filter__title">{parameter.title}</div>
          <div style={{ marginBottom: '10px' }}>
            <RangePicker
              format="YYYY-MM-DD"
              //@ts-ignore
              value={filterParameters[parameter.name as keyof FilterParameters]}
              onChange={(value) =>
                handleFilterParametersChange(value, parameter.type)
              }
              name={parameter.name as string}
            />
          </div>
        </div>
      )
    default:
      return (
        <div
          className="filter"
          style={{ borderBottom: '1px solid rgba(0,0,0,.08)' }}
        >
          <div className="filter__title">Тип эпилепсии(ICD-10-CM)</div>
        </div>
      )
  }
}
