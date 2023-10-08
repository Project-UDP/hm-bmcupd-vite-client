import { useState, useEffect } from "react";
import { User } from "../../types/User";
import { toastUtils } from "../../utils/toastUtils";
import { api } from "../../api/api";
import { localStorageUtil } from "../../utils/localStorageUtils";

export const ProfilePage = (): JSX.Element => {
  const emptyUser: User = {
    username: "",
    password: "",
    firstname: "",
    secondname: "",
    patronymic: "",
    phoneNumber: "",
    birthDate: "",
    speciality: "",
    role: "USER",
  };
  const profileUser = localStorageUtil.user.get() // TODO: not all is loaded data from localStorage
  const [userForm, setUserForm] = useState<User>(emptyUser);
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  
  const handleFormChange = (event: any) => {
    setUserForm({ ...userForm, [event.target.name]: event.target.value });
  };

  const loadUsers = async () => {
    let response

    try {
      response = await api.user.getAll();  
    } catch (error) {
      console.error(error)
      toastUtils.error('Ошибка получения всех пользователей')
      return
    }

    if (!response?.data && !profileUser) {
      return;
    }
    let allUsers = response.data;
    setUsers(allUsers.filter(user => user.id !== profileUser?.id));
  };

  const handleAddUser = async () => {
    if (!userForm.username) {
      toastUtils.error("Заполнить Username");
      return;
    }
    try {
      await api.admin.addUser(userForm); //TODO: refactor
    } catch (error) {
      toastUtils.error("Ошибка запроса или сервера");
      return;
    }
    await loadUsers();
    setUserForm({ ...emptyUser });
  };

  const handleEditModal = (user: User) => {
    setModal(true);
    setEditUser(user);
  };

  const handleRemoveUser = async (id: number) => {
    try {
      await api.admin.removeUser(id);
      await loadUsers();
    } catch (error) {
      toastUtils.error("Ошибка запроса или сервера");
    }
  };

  useEffect(() => {
    (async () => await loadUsers())()
  }, []);

  return (
    <div style={{ margin: "10px" }}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center">
                  {profileUser?.secondname} {profileUser?.firstname} {profileUser?.patronymic}
                </h5>
                <p className="card-text text-center">
                  <strong>День Рождения:</strong> {profileUser?.birthDate}
                </p>
                <p className="card-text text-center">
                  <strong>Номер телефона:</strong> {profileUser?.phoneNumber}
                </p>
                <p className="card-text text-center">
                  <strong>Специализация:</strong> {profileUser?.speciality}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {profileUser?.firstname === "Admin" && ( //FIXME: role always 'USER'
        <>
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow p-4">
                  <h5 className="card-title text-center mb-4">
                    Добавить пользователя
                  </h5>
                  <div className="mb-3">
                    <input
                      name="username"
                      value={userForm.username}
                      onChange={handleFormChange}
                      placeholder="Username"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="password"
                      type="password"
                      value={userForm.password}
                      onChange={handleFormChange}
                      placeholder="Пароль"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="firstname"
                      value={userForm.firstname}
                      onChange={handleFormChange}
                      placeholder="Имя"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="secondname"
                      value={userForm.secondname}
                      onChange={handleFormChange}
                      placeholder="Фамилия"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="patronymic"
                      value={userForm.patronymic}
                      onChange={handleFormChange}
                      placeholder="Отчество"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="speciality"
                      value={userForm.speciality}
                      onChange={handleFormChange}
                      placeholder="Специализация"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="phoneNumber"
                      value={userForm.phoneNumber}
                      onChange={handleFormChange}
                      placeholder="Номер телефона"
                      className="form-control text-center"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      name="birthDate"
                      value={userForm.birthDate}
                      onChange={handleFormChange}
                      type="date"
                      placeholder="Дата рождения"
                      className="form-control text-center"
                    />
                  </div>
                  <button
                    onClick={handleAddUser}
                    className="btn btn-primary w-100"
                  >
                    Добавить пользователя
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow p-4">
                  <h5 className="card-title text-center mb-4">Пользователи</h5>
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="d-flex justify-content-between align-items-center mb-3"
                    >
                      <span>{user.username}</span>
                      <div>
                        <button
                          onClick={() => handleRemoveUser(user.id!)}
                          className="btn btn-danger me-2"
                        >
                          Удалить
                        </button>
                        <button
                          onClick={() => handleEditModal(user)}
                          className="btn btn-primary"
                        >
                          Изменить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {modal && (
        <EditUserModal
          user={editUser!}
          key={editUser?.id}
          handleClose={() => setModal(false)}
          loadUsers={loadUsers}
        />
      )}
    </div>
  );
};

interface ModalProps {
  user: User;
  handleClose: () => void;
  loadUsers: () => Promise<void>;
}

const EditUserModal = ({
  user,
  handleClose,
  loadUsers,
}: ModalProps): JSX.Element => { //TODO: all fields into one object
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState(user.firstname);
  const [secondname, setSecondname] = useState(user.secondname);
  const [patronymic, setPatronymic] = useState(user.patronymic);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [speciality, setSpeciality] = useState(user.speciality);

  const handleEditUser = async () => {
    const response = await api.admin.editUser({
      id: user.id,
      username: username,
      password: password,
      firstname: firstname,
      secondname: secondname,
      patronymic: patronymic,
      speciality: speciality,
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      role: "USER",
    });
    if (response?.status === 200) {
      await loadUsers();
      handleClose();
      return;
    }
    toastUtils.error("");
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h5 className="card-title text-center mb-4">Изменить</h5>
            <div className="mb-3">
              <div className="card-text text-center">{user.username}</div>
            </div>
            <div className="mb-3">
              <input
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="Username"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Пароль"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                value={firstname}
                onChange={event => setFirstname(event.target.value)}
                placeholder="Имя"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                value={secondname}
                onChange={event => setSecondname(event.target.value)}
                placeholder="Фамилия"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                value={patronymic}
                onChange={event => setPatronymic(event.target.value)}
                placeholder="Отчество"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                value={speciality}
                onChange={event => setSpeciality(event.target.value)}
                placeholder="Специальность"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                value={phoneNumber}
                onChange={event => setPhoneNumber(event.target.value)}
                placeholder="Номер телефона"
                className="form-control text-center"
              />
            </div>
            <div className="mb-3">
              <input
                value={birthDate}
                onChange={event => {
                  setBirthDate(event.target.value);
                }}
                type="date"
                placeholder="Дата рождения"
                className="form-control text-center"
              />
            </div>
            <button onClick={handleEditUser} className="btn btn-primary w-100">
              Изменить пользователя
            </button>
            <button
              style={{ margin: "10px 0 10px 0" }}
              onClick={handleClose}
              className="btn btn-danger w-100"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
