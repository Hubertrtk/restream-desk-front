import axiosInstance from './axios'

export const addTicket = (data) => {
  return axiosInstance.post(`/addTicket`, {
    data,
  })
}
