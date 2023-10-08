import { usePatient } from '../../hooks/usePatient'
import { Pagination } from 'antd'
import { FilterCard } from './components/FilterCard'
import { PatientCard } from './components/PatientCard'

export const SearchPage = () => {
  const { pagedPatinets, handlePageChange, currentPageNumber } = usePatient()

  return (
    <>
      <div
        className="container mt-4"
        style={{
          justifyContent: 'space-between',
          fontFamily: 'RobotoRegular,sans-serif',
          fontSize: '14px'
        }}
      >
        <div className="row">
          {/* First column */}
          <FilterCard />
          <div className="col-md-8 col-lg-9">
            <Pagination
              current={currentPageNumber + 1}
              defaultPageSize={6} //FIXME: bugs with pagedPatinets.pageSize
              total={pagedPatinets.totalCount}
              showSizeChanger={false}
              onChange={(value) => handlePageChange(value - 1)}
            />
            <div className="row justify-content-around align-items-center">
              {pagedPatinets.elements.map((patient) => {
                return <PatientCard patient={patient} key={patient.id} />
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
