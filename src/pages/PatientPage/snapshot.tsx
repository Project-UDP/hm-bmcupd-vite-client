import { useLocation, useNavigate } from "react-router-dom";
import { Patient } from "../../types/Patient";
import { Multioption } from "../../types/Multioption";
import { useState } from "react";
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';

export const PatientPage = (): JSX.Element => {

  const { state } = useLocation();
  const patient: Patient = state;

  for (const iterator in patient) {
    const key = (iterator as unknown) as keyof Patient
    let value: any = patient[key];
      if (
        typeof value === "string" &&
        (value.startsWith('{"child"') || value.startsWith('{"value"'))
      ) {
        //@ts-ignore
        patient[key] = JSON.parse(value);
      } 
  }

  const removePrefixDrugoe = (value: string) => {
    if (typeof value === "string" && value.startsWith("Другое")) {
      return value.slice(6)
    }
    return value;
  };

  const [activeTab, setActiveTab] = useState("0");

  const navigate = useNavigate();

  const handleFormChange = (event: React.MouseEvent<HTMLDivElement>) => {
    setActiveTab(event.currentTarget.id);
  };

  const handleRedirectPatientUpdate = () => {
    navigate("/form", { state: { state } });
  };

 

  const handlePatientDataPdfDownload = () => {
    const printElement = ReactDOMServer.renderToString(pdfJSX());
    html2pdf().set({ html2canvas: { scale: 4 } }).from(printElement).save();
  }

  const webJSX = (): JSX.Element => (
    <div>
      <div className="container mb-4">
        <button
          className="btn btn-primary m-2"
          onClick={handleRedirectPatientUpdate}
        >
          Изменить данные
        </button>
        <button
          className="btn btn-primary m-2"
          onClick={handlePatientDataPdfDownload}
        >
          Скачать
        </button>
        <p style={{ display: 'inline-block' }}>Последний изменено - {patient.lastEditingUser}</p>
       

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Паспортные данные пациента</h3>
            <div
              className="row"
              style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
            >
              <div className="col-sm my-2">
                <strong>Регистрационный № документа - </strong>
                {patient.registrationNumber}
              </div>
              <div className="col-sm my-2">
                <strong>Дата регистрации - </strong>
                {patient.registrationDate.toString()} 
              </div>
            </div>

            <div
              className="col-sm mt-3 pb-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
            >
              <h5 style={{ textAlign: "left" }}>ДАННЫЕ ПАЦИЕНТА</h5>
              <div className="col-sm ms-2">
                <div className="row">
                  <div className="col-sm-7">
                    <strong>Фамилия - </strong>
                    {patient.secondName}
                  </div>
                  <div className="col-sm-5">
                    <strong>ИИН - </strong>
                    {patient.iin}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-7">
                    <strong>Имя - </strong>
                    {patient.firstName}
                  </div>
                  <div className="col-sm-5">
                    <strong>Дата Рождения - </strong>
                    {patient.dateOfBirth?.toString()}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-7">
                    <strong>Отечество - </strong>
                    {patient.patronymic}
                  </div>

                  <div className="col-sm-5">
                    <div className="row">
                      <div className="col-md-auto">
                        <strong>Пол - </strong>
                        {patient.isMale ? "Мужчина" : "Женщина"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-sm mt-3 pb-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
            >
              <strong>Адрес проживания:</strong>
              <div className="col-sm ms-2">
                <div className="row">
                  <div className="col-sm-7">
                    <strong>Область рождения - </strong>
                    {patient.birthRegion}
                  </div>
                  <div className="col-sm-5">
                    <strong>Область проживания - </strong>
                    {patient.livingRegion}
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-7">
                    <strong>Место рождения - </strong>
                    {patient.birthAddress}
                  </div>
                  <div className="col-sm-5">
                    <strong>Место проживания - </strong>
                    {patient.livingAddress}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-sm mt-3 pb-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
            >
              <strong>Контактный телефон: </strong>
              <div className="col-sm ms-2">
                <div className="row">
                  <div className="col-sm ms-2">
                    <div className="col-md-auto">{patient.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-sm mt-3 pb-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
            >
              <strong>Доминантная рука: </strong>
              <div className="col-sm ms-2">
                <div className="row">
                  <div className="col-sm ms-2">
                    <div className="col-md-auto">
                      {patient.isRightHanded ? "Правая" : "Левая"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row">
                    <strong>Резидент РК - </strong>
                    {patient.isResident ? 'Да' : 'Нет'}
                  </div>
                  <div className="flex-row">
                    <strong>Национальсность - </strong>
                    {removePrefixDrugoe(patient.nationality)}
                  </div>
                  <div className="flex-row">
                    <strong>Семейное положение - </strong>
                    {patient.familyStatus}
                  </div>
                  <div className="flex-row">
                    <strong>Образование - </strong>
                    {patient.educationProfession}
                  </div>
                  <div className="flex-row">
                    <strong>Занятость - </strong>
                    {patient.workStatus}
                  </div>
                  <div className="flex-row">
                    <strong>Диспансерный учет (дата учета) -</strong>{" "}
                    {patient.dispensaryRegistration?.toString()}
                  </div>
                  <div className="flex-row">
                    <strong>Вождение автомобиля - </strong>
                    {patient.isDriver ? "Да" : "Нет"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Перинатальный анамнез</h3>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Ребенок по счету: </strong>
                    {patient.childCount}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>
                      Особенности течение беременности матери (антенатальный
                      период):
                    </strong>
                      {<RecursiveMultioptionDisplay
                        data={patient.pregnancyFeatures as Multioption}
                      />}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Особенности родов (интранатальный период):</strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.childBirthFeatures as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>
                      Особенности после родов (постнатальный период):
                    </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.afterBirthFeatures as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Ранее развитие (Формула развития ребенка):</strong>
                    {patient.childEarlyDevelopment}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Анамнез эпилепсии</h3>
            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>ФС: </strong>
                    {patient.isFS}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Нейроинфекция: </strong>
                    {removePrefixDrugoe(patient.neuroinfection)}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Возраст первого приступа: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.ageOfTheFirstAttack as Multioption}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            <h5 style={{ textAlign: "center" }}>Типы приступов</h5>
            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Неонатальный и младенческий возраст: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.neonatalAndInfantAge as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Детский и юношеский возраст: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.childrenAndYouth as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Взрослый и пожилой возраст: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.adultAndElderly as Multioption}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            <h5 style={{ textAlign: "center" }}>Эпилептический статус (ЭС)</h5>
            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>С выраженными двигательными симптомами: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.withMotorSymptoms as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>
                      Без выраженной двигательной симптоматики (без судорожный
                      ЭС):{" "}
                    </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.noMotorSymptoms as Multioption}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Фактическая ситуация</h3>
            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Взрослый и пожилой возраст: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={
                          patient.actualSituationAdultAndElderly as Multioption
                        }
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Тип эпилепсий: </strong>
                    {patient.epilepsyType}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>МКБ-10: </strong>
                    {removePrefixDrugoe(patient.icd)}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Длительность приступа: </strong>
                    {patient.durationOfTheAttack}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Особенности приступов:</strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.featuresOfSeizures as Multioption}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>
              Противосудорожные препараты (ПСП)
            </h3>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>В дебюте: </strong>
                    {removePrefixDrugoe(patient.inTheDebut)}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Последующая терапия: </strong>
                    {removePrefixDrugoe(patient.followUpTherapy)}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Текущая терапия: </strong>
                    {removePrefixDrugoe(patient.currentTherapy)}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Типы лечения: </strong>
                    {patient.healTypes}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Оценка эффективности: </strong>
                    {patient.effectivenessGrade}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>
              Инструментальное исследование
            </h3>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Виды ЭЭГ: </strong>
                    {patient.typesOfEEG}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Результат интериктального ЭЭГ: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.resultOfInterictalEEG as Multioption}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            <h5 style={{ textAlign: "center" }}>Распространённость</h5>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Результат иктального ЭЭГ: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={
                          patient.prevalenceResultOfInterictalEEG as Multioption
                        }
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Локализация: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.localization as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Типы: </strong>
                    {patient.types}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Латерализация: </strong>
                    {patient.lateralization}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Результат МРТ</h3>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Локализация: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.localizationnMRI as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Латерализация: </strong>
                    {patient.lateralizationMRI}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Диагноз по МРТ: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.diagnosisMRI as Multioption}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {true && (
          <div
            className="container"
            style={{
              fontSize: "17px",
              border: "1px solid rgba(0,0,0,.08)",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>ПЭТ КТ результат</h3>

            <div
              className="d-flex mt-3 pb-2"
              style={{
                borderBottom: "1px solid rgba(0,0,0,.08)",
              }}
            >
              <div>
                <div
                  className="pb-2"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.08)",
                  }}
                >
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Локализация: </strong>
                    {
                      <RecursiveMultioptionDisplay
                        data={patient.localizationPETCT as Multioption}
                      />
                    }
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Латерализация: </strong>
                    {patient.lateralizationPETCT}
                  </div>
                  <div className="flex-row" style={{ marginBottom: "10px" }}>
                    <strong>Заключение: </strong>
                    {patient.resultPETCT}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const pdfJSX = (): JSX.Element => (
    <div>
    <div className="container mb-4">
      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Паспортные данные пациента</h3>
          <div
            className="row"
            style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
          >
            <div className="col-sm my-2">
              <strong>Регистрационный № документа - </strong>
              {patient.registrationNumber}
            </div>
            <div className="col-sm my-2">
              <strong>Дата регистрации - </strong>
              {patient.registrationDate.toString()} 
            </div>
          </div>

          <div
            className="col-sm mt-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
          >
            <h5 style={{ textAlign: "left" }}>ДАННЫЕ ПАЦИЕНТА</h5>
            <div className="col-sm ms-2">
              <div className="row">
                <div className="col-sm-7">
                  <strong>Фамилия - </strong>
                  {patient.secondName}
                </div>
                <div className="col-sm-5">
                  <strong>ИИН - </strong>
                  {patient.iin}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-7">
                  <strong>Имя - </strong>
                  {patient.firstName}
                </div>
                <div className="col-sm-5">
                  <strong>Дата Рождения - </strong>
                  {patient.dateOfBirth?.toString()}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-7">
                  <strong>Отечество - </strong>
                  {patient.patronymic}
                </div>

                <div className="col-sm-5">
                  <div className="row">
                    <div className="col-md-auto">
                      <strong>Пол - </strong>
                      {patient.isMale ? "Мужчина" : "Женщина"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-sm mt-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
          >
            <strong>Адрес проживания:</strong>
            <div className="col-sm ms-2">
              <div className="row">
                <div className="col-sm-7">
                  <strong>Область рождения - </strong>
                  {patient.birthRegion}
                </div>
                <div className="col-sm-5">
                  <strong>Область проживания - </strong>
                  {patient.livingRegion}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-7">
                  <strong>Место рождения - </strong>
                  {patient.birthAddress}
                </div>
                <div className="col-sm-5">
                  <strong>Место проживания - </strong>
                  {patient.livingAddress}
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-sm mt-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
          >
            <strong>Контактный телефон: </strong>
            <div className="col-sm ms-2">
              <div className="row">
                <div className="col-sm ms-2">
                  <div className="col-md-auto">{patient.phoneNumber}</div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-sm mt-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,.08)" }}
          >
            <strong>Доминантная рука: </strong>
            <div className="col-sm ms-2">
              <div className="row">
                <div className="col-sm ms-2">
                  <div className="col-md-auto">
                    {patient.isRightHanded ? "Правая" : "Левая"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row">
                  <strong>Резидент РК - </strong>
                  {patient.isResident ? 'Да' : 'Нет'}
                </div>
                <div className="flex-row">
                  <strong>Национальсность - </strong>
                  {removePrefixDrugoe(patient.nationality)}
                </div>
                <div className="flex-row">
                  <strong>Семейное положение - </strong>
                  {patient.familyStatus}
                </div>
                <div className="flex-row">
                  <strong>Образование - </strong>
                  {patient.educationProfession}
                </div>
                <div className="flex-row">
                  <strong>Занятость - </strong>
                  {patient.workStatus}
                </div>
                <div className="flex-row">
                  <strong>Диспансерный учет (дата учета) -</strong>{" "}
                  {patient.dispensaryRegistration?.toString()}
                </div>
                <div className="flex-row">
                  <strong>Вождение автомобиля - </strong>
                  {patient.isDriver ? "Да" : "Нет"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Перинатальный анамнез</h3>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Ребенок по счету: </strong>
                  {patient.childCount}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>
                    Особенности течение беременности матери (антенатальный
                    период):
                  </strong>
                    {<RecursiveMultioptionDisplay
                      data={patient.pregnancyFeatures as Multioption}
                    />}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Особенности родов (интранатальный период):</strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.childBirthFeatures as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>
                    Особенности после родов (постнатальный период):
                  </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.afterBirthFeatures as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Ранее развитие (Формула развития ребенка):</strong>
                  {patient.childEarlyDevelopment}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Анамнез эпилепсии</h3>
          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>ФС: </strong>
                  {patient.isFS}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Нейроинфекция: </strong>
                  {removePrefixDrugoe(patient.neuroinfection)}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Возраст первого приступа: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.ageOfTheFirstAttack as Multioption}
                    />
                  }
                </div>
              </div>
            </div>
          </div>

          <h5 style={{ textAlign: "center" }}>Типы приступов</h5>
          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Неонатальный и младенческий возраст: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.neonatalAndInfantAge as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Детский и юношеский возраст: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.childrenAndYouth as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Взрослый и пожилой возраст: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.adultAndElderly as Multioption}
                    />
                  }
                </div>
              </div>
            </div>
          </div>

          <h5 style={{ textAlign: "center" }}>Эпилептический статус (ЭС)</h5>
          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>С выраженными двигательными симптомами: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.withMotorSymptoms as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>
                    Без выраженной двигательной симптоматики (без судорожный
                    ЭС):{" "}
                  </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.noMotorSymptoms as Multioption}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Фактическая ситуация</h3>
          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Взрослый и пожилой возраст: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={
                        patient.actualSituationAdultAndElderly as Multioption
                      }
                    />
                  }
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Тип эпилепсий: </strong>
                  {patient.epilepsyType}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>МКБ-10: </strong>
                  {removePrefixDrugoe(patient.icd)}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Длительность приступа: </strong>
                  {patient.durationOfTheAttack}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Особенности приступов:</strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.featuresOfSeizures as Multioption}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            Противосудорожные препараты (ПСП)
          </h3>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>В дебюте: </strong>
                  {removePrefixDrugoe(patient.inTheDebut)}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Последующая терапия: </strong>
                  {removePrefixDrugoe(patient.followUpTherapy)}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Текущая терапия: </strong>
                  {removePrefixDrugoe(patient.currentTherapy)}
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Типы лечения: </strong>
                  {patient.healTypes}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Оценка эффективности: </strong>
                  {patient.effectivenessGrade}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            Инструментальное исследование
          </h3>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Виды ЭЭГ: </strong>
                  {patient.typesOfEEG}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Результат интериктального ЭЭГ: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.resultOfInterictalEEG as Multioption}
                    />
                  }
                </div>
              </div>
            </div>
          </div>

          <h5 style={{ textAlign: "center" }}>Распространённость</h5>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Результат иктального ЭЭГ: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={
                        patient.prevalenceResultOfInterictalEEG as Multioption
                      }
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Локализация: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.localization as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Типы: </strong>
                  {patient.types}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Латерализация: </strong>
                  {patient.lateralization}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Результат МРТ</h3>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Локализация: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.localizationnMRI as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Латерализация: </strong>
                  {patient.lateralizationMRI}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Диагноз по МРТ: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.diagnosisMRI as Multioption}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div
          className="container"
          style={{
            fontSize: "17px",
            border: "1px solid rgba(0,0,0,.08)",
            boxSizing: "border-box",
            borderRadius: "8px",
            padding: "0 20px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>ПЭТ КТ результат</h3>

          <div
            className="d-flex mt-3 pb-2"
            style={{
              borderBottom: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <div>
              <div
                className="pb-2"
                style={{
                  borderBottom: "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Локализация: </strong>
                  {
                    <RecursiveMultioptionDisplay
                      data={patient.localizationPETCT as Multioption}
                    />
                  }
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Латерализация: </strong>
                  {patient.lateralizationPETCT}
                </div>
                <div className="flex-row" style={{ marginBottom: "10px" }}>
                  <strong>Заключение: </strong>
                  {patient.resultPETCT}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  )

  return webJSX();
};

interface RProps {
  data: Multioption | Multioption[];
}

const RecursiveMultioptionDisplay = ({ data }: RProps): JSX.Element => {
  if (!data) {
    return <></>
  }

  if (Array.isArray(data)) {
    return (
      <>
        {data.map((multioption: Multioption) => {
          return (
            <div style={{ marginLeft: "30px" }}>
              <li>{multioption.value === 'Выберите' ? 'Не указан' : multioption.value}</li>
              {multioption.child && (
                <RecursiveMultioptionDisplay data={multioption.child} />
              )}
            </div>
          );
        })}
      </>
    );
  }

  if (!data.value) return <></>;

  return (
    <div style={{ marginLeft: "30px" }}>
      <li>{data.value === 'Выберите' ? 'Не указан' : data.value}</li> 
      {data.child && <RecursiveMultioptionDisplay data={data.child} />}
    </div>
  );
};
