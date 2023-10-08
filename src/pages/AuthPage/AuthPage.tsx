import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export const AuthPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { onLogin, token } = useAuth()

  if (token) {
    return <Navigate to="/search" replace />
  }

  return (
    //FIXME: auto-fill makes inputs obsolete
    <>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="authorization-box text-center p-4"
          style={{
            fontSize: '17px',
            border: '1px solid rgba(0,0,0,.08)',
            boxSizing: 'border-box',
            borderRadius: '8px',
            padding: '0 20px'
          }}
        >
          <h1 className="mb-4">
            <img
              className="col-md-auto mx-auto text-center"
              src="./bmcudp_logo.png"
              style={{ textAlign: 'center' }}
              alt=""
            />
          </h1>
          <h2>Авторизация</h2>
          <div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="username"
                required
                value={username}
                placeholder="Имя пользователя"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                required
                value={password}
                placeholder="Пароль"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                onLogin(username, password)
              }}
            >
              Авторизоваться
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
