import { Patient } from '../../../types/Patient'
import { Multioption } from '../../../types/Multioption'

interface Props {
  formData: Patient
  handleInput: any
  formFields: FormField[]
}

export interface FormField {
  name: string
  label: string
  type: string
  options?: Option[]
  boxes?: {
    name: string
    label: string
  }[]
}

interface Option {
  label: string
  value: string
  isCheckbox?: boolean
  isOther?: boolean
  options?: Option[]
}

export const PatientDetailsForm = ({
  formData,
  handleInput,
  formFields
}: Props): JSX.Element => {
  const handleMultioptionInput = (
    event: any,
    data: Multioption,
    dataArr?: Multioption[],
    label?: string
  ) => {
    if (event.target.type === 'checkbox') {
      if (event.target.checked) {
        dataArr!.push({ value: label! })
      } else {
        for (let i = 0; i < dataArr!.length; i++) {
          if (dataArr![i].value === label) {
            dataArr!.splice(i, 1)
          }
        }
      }
      handleInput(event, data)
      return
    }

    let newValue = event.target.value
    data.value = newValue
    data.child = undefined
    handleInput(event, data)
  }

  return (
    <>
      {formFields.map((field) => {
        switch (field.type) {
          case 'label':
            return (
              <div key={field.name} className="mb-3">
                <h4>{field.label}</h4>
              </div>
            )
          case 'options':
            const value = formData[
              field.name as keyof typeof formData
            ] as string
            let parentValue = value
            let otherField = () => <></>
            if (
              typeof value !== 'boolean' &&
              typeof value === 'string' &&
              value.startsWith('Другое')
            ) {
              parentValue = value.slice(0, 6)
              otherField = () => (
                <input
                  onChange={(event) => {
                    event.target.value = 'Другое' + event.target.value
                    handleInput(event)
                  }}
                  type="text"
                  className="form-control"
                  id={field.name}
                  value={value.slice(6)}
                />
              )
            }
            return (
              <div key={field.name} className="mb-3">
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <select
                  onChange={handleInput}
                  id={field.name}
                  className="form-select"
                  aria-label="Default select example"
                  value={parentValue}
                >
                  {/*@ts-ignore*/}
                  <option value={undefined}>Выберите</option>
                  {field.options?.map((option): any => {
                    return (
                      <option
                        key={field.name + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  })}
                </select>
                <div style={{ marginTop: '10px' }}>{otherField()}</div>
              </div>
            )
          case 'multioptions':
            let suboption: Option | undefined
            let data = formData[
              field.name as keyof typeof formData
            ] as Multioption
            return (
              <>
                <div key={field.name} className="mb-3">
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <select
                    onChange={(event) => handleMultioptionInput(event, data)}
                    id={field.name}
                    className="form-select"
                    aria-label="Default select example"
                    value={data.value}
                  >
                    <option selected>Выберите</option>
                    {field.options?.map((option): any => {
                      if (option.options && data.value === option.value) {
                        suboption = option
                      }
                      return (
                        <option
                          key={field.name + option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      )
                    })}
                  </select>
                </div>
                {suboption && (
                  <div style={{ marginLeft: '2px' }} className="form-check">
                    <RecursiveOptions
                      id={field.name}
                      isCheckbox={suboption.isCheckbox!}
                      options={suboption.options!}
                      handleInput={handleMultioptionInput}
                      data={data}
                    />
                  </div>
                )}
              </>
            )
          case 'checkbox':
            return (
              <div key={field.name}>
                <label>{field.label}</label>
                {field.boxes?.map((box) => {
                  return (
                    <div key={field.name + box.name} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={field.name}
                        name={box.name}
                        onChange={handleInput}
                        checked={
                          // @ts-ignore
                          (
                            formData[
                              field.name as keyof typeof formData
                            ] as Array<string | number>
                          ).includes(box.name)
                        }
                      />
                      <label className="form-check-label" htmlFor={box.name}>
                        {box.label}
                      </label>
                    </div>
                  )
                })}
              </div>
            )
          default:
            const isRequired =
              field.name === 'iin' ||
              field.name === 'firstName' ||
              field.name === 'secondName' ||
              field.name === 'dateOfBirth' ||
              field.name === 'registrationNumber'
            const isEmpty =
              formData[field.name as keyof typeof formData] === '' ||
              formData[field.name as keyof typeof formData] === null
            let style = {}
            if (isRequired && isEmpty) {
              style = { borderColor: 'red' }
            }
            return (
              <div key={field.name} className="mb-3">
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>

                {Object.keys(style).length !== 0 && (
                  <p
                    style={{
                      display: 'inline-block',
                      marginLeft: '3px',
                      fontSize: '12px',
                      color: 'red'
                    }}
                    className="form-label"
                  >
                    * обязательное
                  </p>
                )}
                <input
                  onChange={handleInput}
                  type={field.type}
                  className="form-control"
                  style={style}
                  id={field.name}
                  value={
                    formData[field.name as keyof typeof formData] as string
                  }
                />
              </div>
            )
        }
      })}
    </>
  )
}

const isChecked = (data: Array<Multioption>, value: string): boolean => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].value === value) {
      return true
    }
  }
  return false
}

const retrieve = (data: Array<Multioption>, value: string): Multioption => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].value === value) {
      return data[i]
    }
  }
  return { value: 'FIXXX' } //FIXME:
}

const RecursiveOptions = ({
  id,
  isCheckbox,
  options,
  handleInput,
  data
}: {
  id: string
  isCheckbox: boolean
  options: Option[]
  handleInput: any
  data: Multioption
}): JSX.Element => {
  let childData: Multioption | Array<Multioption>
  let suboption: Option | undefined

  if (isCheckbox) {
    if (!data.child) {
      data.child = []
    }
    childData = data.child as Array<Multioption>
    return (
      <div>
        {options.map((option) => {
          suboption = undefined
          if (
            option.options &&
            isChecked(childData as Array<Multioption>, option.value)
          ) {
            suboption = option
          }
          return (
            <div key={data.value + option.value} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={id}
                onChange={(event) =>
                  handleInput(event, childData, childData, option.label)
                }
                checked={isChecked(
                  childData as Array<Multioption>,
                  option.value
                )}
              />
              <label className="form-check-label">{option.label}</label>

              {suboption! &&
                isChecked(childData as Array<Multioption>, option.value) && (
                  <div style={{ marginLeft: '2px' }} className="form-check">
                    <RecursiveOptions
                      id={id}
                      isCheckbox={suboption.isCheckbox!}
                      options={suboption.options!}
                      handleInput={handleInput}
                      data={retrieve(childData as Multioption[], option.value)}
                    />
                  </div>
                )}
            </div>
          )
        })}
      </div>
    )
  }

  if (!data.child) {
    data.child = { value: '' }
  }
  childData = data.child as Multioption
  return (
    <>
      <div className="mb-3">
        <select
          onChange={(event) => handleInput(event, childData)}
          id={id}
          className="form-select"
          aria-label="Default select example"
          value={childData.value}
        >
          <option selected>Выберите</option>
          {options?.map((option): any => {
            if (
              option.options &&
              (childData as Multioption).value === option.value
            ) {
              suboption = option
            }
            return (
              <option key={data.value + option.value} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      </div>
      {suboption! && (
        <div style={{ marginLeft: '20px' }}>
          <RecursiveOptions
            id={id}
            isCheckbox={suboption.isCheckbox!}
            options={suboption.options!}
            handleInput={handleInput}
            data={childData}
          />
        </div>
      )}
    </>
  )
}
