import { FilterParameter } from "./FilterParameter";
import { usePatient } from "../../../hooks/usePatient";

export const FilterCard = (): JSX.Element => {
    
  return (
    <div
      className="search-filter col-md-4 col-lg-3"
      style={{
        marginBottom: "20px",
      }}
    >
      <div className="search-filter_filter_title">Фильтр</div>

      <div
        className="search-filter_filter_items"
        style={{
          border: "1px solid rgba(0,0,0,.08)",
          boxSizing: "border-box",
          borderRadius: "8px",
          padding: "0 20px",
        }}
      >
        {filterParameterOptions.map((parameter) => (
          <FilterParameter
            key={parameter.name}
            parameter={parameter}
          />
        ))}
      </div>
    </div>
  );
};

export interface FilterParam {
  title: string;
  name: string;
  type: string;
  options?: {
    value: string;
    label: string;
  }[];
}

const filterParameterOptions: FilterParam[] = [
  {
    title: "Дата регистраций",
    name: "registrationDate",
    type: "date-range",
  },
  {
    title: "Пол",
    name: "isMale",
    type: "radio",
    options: [
      {
        value: "",
        label: "Любой",
      },
      {
        value: "true",
        label: "Мужчина",
      },
      {
        value: "false",
        label: "Женщина",
      },
    ],
  },
  {
    title: "Ведущая рука",
    name: "isRightHanded",
    type: "radio",
    options: [
      {
        value: "",
        label: "Любой",
      },
      {
        value: "true",
        label: "Правая",
      },
      {
        value: "false",
        label: "Левая",
      },
    ],
  },
  {
    title: "Возрастная категория",
    name: "age",
    type: "radio",
    options: [
      {
        label: "Любой",
        value: "",
      },
      {
        label: "до 1 года младенчество",
        value: JSON.stringify([0, 1]),
      },
      {
        label: "ранее детство 1-3",
        value: JSON.stringify([1, 3]),
      },
      {
        label: "дошкольное детство – 3-6",
        value: JSON.stringify([3, 6]),
      },
      {
        label: "младший школьный 6-7 и 10-11",
        value: JSON.stringify([6, 11]),
      },
      {
        label: "подростковый 10-11 и до 14-15",
        value: JSON.stringify([10, 15]),
      },
      {
        label: "юношеский 14-18",
        value: JSON.stringify([14, 18]),
      },
      {
        label: "18-44 молодой",
        value: JSON.stringify([18, 44]),
      },
      {
        label: "45-59 средний",
        value: JSON.stringify([45, 59]),
      },
      {
        label: "60-74 пожилой",
        value: JSON.stringify([60, 74]),
      },
      {
        label: "75-90 старческий",
        value: JSON.stringify([75, 90]),
      },
      {
        label: "90 и выше долгожители",
        value: JSON.stringify([90, 300]),
      },
    ],
  },
  {
    title: "Тип эпилепсий",
    name: "epilepsyType",
    type: "radio",
    options: [
      {
        value: "",
        label: "Любой",
      },
      {
        label: "фокальная",
        value: "фокальная",
      },
      {
        label: "генерализованная",
        value: "генерализованная",
      },
      {
        label: "комбинированная",
        value: "комбинированная",
      },
      {
        label: "неуточненная",
        value: "неуточненная",
      },
    ],
  },
  {
    title: "МКБ-10",
    name: "icd",
    type: "radio",
    options: [
      {
        value: "",
        label: "Любой",
      },
      {
        label: "G40.1",
        value: "G40.1",
      },
      {
        label: "G40.2",
        value: "G40.2",
      },
      {
        label: "G40.3",
        value: "G40.3",
      },
      {
        label: "G40.4",
        value: "G40.4",
      },
      {
        label: "G40.5",
        value: "G40.5",
      },
      {
        label: "G40.6",
        value: "G40.6",
      },
      {
        label: "G40.7",
        value: "G40.7",
      },
      {
        label: "G40.8",
        value: "G40.8",
      },
      {
        label: "G40.9",
        value: "G40.9",
      },
      {
        label: "G41.1",
        value: "G41.1",
      },
      {
        label: "G41.2",
        value: "G41.2",
      },
      {
        label: "G41.8",
        value: "G41.8",
      },
      {
        label: "G41.9",
        value: "G41.9",
      },
    ],
  },
];
