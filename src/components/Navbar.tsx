import { useState } from "react";
import ".././App.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { localStorageUtil } from "../utils/localStorageUtils";
import { usePatient } from "../hooks/usePatient";

export const Navbar = (): JSX.Element => {
  const [search, setSearch] = useState<string>("");

  const { onLogout } = useAuth();

  const { loadPatients, filterParameters, currentPageNumber } = usePatient()

  const handleSearch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await loadPatients(filterParameters, currentPageNumber, search)
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-light" style={{ background: "#3498db", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)", top:"0", position:"sticky", zIndex: "300" }}>
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <div className="navbar-brand">
            <img src="/bmcudp_logo.png" alt="" />
          </div>
          <ul className="navbar-nav me-5 mb-2 mb-lg-0">
            <li className="nav-item">
              <div className="nav-link active" aria-current="page">
                <NavLink
                  to={"/search"}
                  style={{
                    color: "black",
                    fontFamily: "RobotoRegular, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  Главная страница
                </NavLink>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <NavLink
                  to={"/form"}
                  style={{
                    fontFamily: "RobotoRegular, sans-serif",
                    textDecoration: "none",
                  }}
                >
                  Добавить пациента
                </NavLink>
              </div>
            </li>
          </ul>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="ФИО или ИИН"
              aria-label="Search"
              style={{ width: "25rem", height: "3rem" }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              onClick={handleSearch}
              className="btn btn-outline-success"
              type="submit"
            >
              Поиск
            </button>
          </form>
          <ul className="navbar-nav ms-auto me-2">
            <li className="nav-item dropdown">
              <div
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: "black", fontSize: "20px" }}
              >
                {(() => {
                  const user = localStorageUtil.user.get()
                  return `${user?.secondname || ''} ${user?.firstname || ''} ${user?.patronymic || ''}`
                })()}
              </div>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <div className="dropdown-item">
                    <NavLink
                      to={"/profile"}
                      style={{
                        color: "black",
                        textDecoration: "none",
                      }}
                    >
                      Профиль
                    </NavLink>
                  </div>
                  <div className="dropdown-item">
                    <NavLink
                      to={"/dashboard"}
                      style={{
                        color: "black",
                        textDecoration: "none",
                      }}
                    >
                      Статистика
                    </NavLink>
                  </div>
                  <div className="dropdown-item">
                    <NavLink
                      to={"/appointment"}
                      style={{
                        color: "black",
                        textDecoration: "none",
                      }}
                    >
                      Приемы
                    </NavLink>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <div onClick={onLogout} className="dropdown-item">
                    Выйти
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
