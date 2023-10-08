import { AgeBar } from "./components/AgeBar";
import { DominantHandDoughnut } from "./components/DominantHandDoughnut";
import { GenderDoughnut } from "./components/GenderDoughnut";
import { IcdCounts } from "./components/IcdCounts";
import { NationalityDoughnut } from "./components//NationalityDoughnut";
import { PatinetCount } from "./components/PatientCount";
import { RegionsBar } from "./components/RegionsBar";
import { RegistrationLineCard } from "./components/RegistrationLine/RegistrationLineCard";

export const DashboardPage = (): JSX.Element => {
  return (
    <div className="container mt-4">
      {/* Row 1: PatinetCount Chart */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <PatinetCount />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Individual Charts */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Гендерное распределение</h5>
              <GenderDoughnut />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Доминантная рука</h5>
              <DominantHandDoughnut />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Национальность</h5>
              <NationalityDoughnut />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: More Individual Charts */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Распределение по возрасту</h5>
              <AgeBar />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: RegionsBar */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Регионы</h5>
              <RegionsBar />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: RegistrationLineCard */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Регистрация пациентов</h5>
              <RegistrationLineCard />
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: IcdCounts */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Количество МКБ-10</h5>
              <IcdCounts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
