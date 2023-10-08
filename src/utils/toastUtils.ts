import { toast } from 'react-toastify'

export const toastUtils = {
  success: (content: string) => {
    toast.success(`Успешно! ${content}`, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  },

  error: (content: string) => {
    toast.error(`Ошибка! ${content}`, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }
}
