import './App.css'
import { Navbar } from './components/Navbar'
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage/AuthPage'
import { AuthProvider } from './hooks/useAuth'
import { useAuth } from './hooks/useAuth'
import { PatientProvider } from './hooks/usePatient'
import { SearchPage } from './pages/SearchPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { AppointmentPage } from './pages/AppointmentPage'
import { FormPage } from './pages/FormPage'
import { PatientPage } from './pages/PatientPage'

const App = (): JSX.Element => {
  const ProtectedRoute = ({ children }: any) => {
    const { token } = useAuth()
    if (!token) return <Navigate to="/login" replace />
    return children
  }
  //FIXME:infinite page refresh, when url is http://localhost:3000/patient/:id
  const RenderIfAuth = ({ children }: any) => {
    const { token } = useAuth()
    if (token) {
      return children
    }
    return <></>
  }

  //const { data: posts } = postApi.useFetchAllPostsQuery(5)

  return (
    <div className="app">
      {/* {posts?.map(post => (post.body))} */}

      <BrowserRouter>
        <AuthProvider>
          <PatientProvider>
            <RenderIfAuth>
              <Navbar />
            </RenderIfAuth>
            <Routes>
              {routes.map(({ path, element, authRequired }) => {
                if (!authRequired) {
                  return <Route key={path} path={path} element={element} />
                }

                return (
                  <Route
                    key={path}
                    path={path}
                    element={<ProtectedRoute>{element}</ProtectedRoute>}
                  />
                )
              })}
            </Routes>
          </PatientProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

const routes: AppRoute[] = [
  {
    path: '/login',
    element: <AuthPage />,
    authRequired: false
  },
  {
    path: '/search',
    element: <SearchPage />,
    authRequired: true
  },
  {
    path: '/form',
    element: <FormPage />,
    authRequired: true
  },
  {
    path: '/patient',
    element: <PatientPage />,
    authRequired: true
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    authRequired: true
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    authRequired: true
  },
  {
    path: '/appointment',
    element: <AppointmentPage />,
    authRequired: true
  },
  {
    path: '*',
    element: <Navigate replace to="login" />,
    authRequired: false
  }
]

interface AppRoute {
  path: string
  element: JSX.Element
  authRequired: boolean
}

export default App
