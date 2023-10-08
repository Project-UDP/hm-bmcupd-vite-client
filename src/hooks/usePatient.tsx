import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { toastUtils } from "../utils/toastUtils";
import { api } from "../api/api";
import { Patient } from "../types/Patient";
import { PagedResponse } from "../types/PagedResponse";
import { FilterParameters } from "../types/FilterParameters";
import dayjs from "dayjs";
import { regexUtils } from "../utils/regexUtils";

export const usePatient = () => useContext(PatientContext);

interface PatientContextInterface {
  pagedPatinets: PagedResponse<Patient>;
  loadPatients: (
    parameters: FilterParameters,
    pageNumber?: number,
    query?: string
  ) => Promise<void>;
  loadPatientsWithPreviouslySetParams: () => Promise<void>
  filterParameters: FilterParameters;
  handleFilterParametersChange: (event: any, type?: string) => void;
  currentPageNumber: number;
  handlePageChange: (pageNumber: number) => void;
}

export const PatientContext = createContext<PatientContextInterface>({
  pagedPatinets: {
    elements: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
    pageOffset: 0,
    pageTotal: 0,
  },
  loadPatients: async () => {},
  loadPatientsWithPreviouslySetParams: async () => {},
  filterParameters: {},
  handleFilterParametersChange: (event, type) => {
    console.log(event, type);
  },
  currentPageNumber: 0,
  handlePageChange: pageNumber => {
    console.log(pageNumber);
  },
});

export const PatientProvider = ({ children }: any) => {
  const [pagedPatinets, setPagedPatients] = useState<PagedResponse<Patient>>({
    elements: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
    pageOffset: 0,
    pageTotal: 0,
  });
  const [filterParameters, setFilterParameters] = useState<FilterParameters>(
    {}
  );
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      await loadPatients(filterParameters, currentPageNumber);
    })();
  }, [filterParameters, currentPageNumber]);

  const loadPatients = async (
    parameters: FilterParameters,
    pageNumber: number = 0,
    query: string = ""
  ) => {
    // if (regexUtils.containsOnlyNumbers(query)) {
    //   api.patient.getByIin(query)
    // }
    parameters.fio = query; // TODO: make iin searchable
    try {
      const response = await api.patient.getPagedFiltered(
        parameters,
        pageNumber
      );
      if (response?.status === 200) {
        setPagedPatients(response.data);
      }
    } catch (error) {
      toastUtils.error("Ошибка запроса или сервера");
    }
  };

  const loadPatientsWithPreviouslySetParams = async () => {
    await loadPatients(filterParameters, currentPageNumber);
  }

  const handleFilterParametersChange = (event: any, type?: string) => {
    if (type === "date-range") {
      if (!event) {
        setFilterParameters({
          ...filterParameters,
          registrationDate: undefined,
        });
        resetPage();
        return;
      }
      const start = dayjs(event[0]);
      const end = dayjs(event[1]);
      const value = [start, end];
      setFilterParameters({ ...filterParameters, registrationDate: value });
      resetPage();
      return;
    }
    const key = event.target.name;
    const value = event.target.value;
    console.log({ ...filterParameters, [key]: value });
    setFilterParameters({ ...filterParameters, [key]: value });
    resetPage();
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPageNumber(pageNumber);
  };

  const resetPage = () => {
    setCurrentPageNumber(0);
  };

  const value: PatientContextInterface = {
    pagedPatinets,
    loadPatients,
    loadPatientsWithPreviouslySetParams,
    filterParameters,
    handleFilterParametersChange,
    currentPageNumber,
    handlePageChange,
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};
