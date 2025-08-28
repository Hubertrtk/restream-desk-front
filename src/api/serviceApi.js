import axiosInstance from './axios'

export const addTicket = (data) => {
  return axiosInstance.post(`/addTicket`, data)
}

export const getGroups = () => {
  return axiosInstance.get(`/getGroups`)
}

export const getGroupTickets = (groupId) => {
  return axiosInstance.post(`/getGroupTickets`, { groupId })
}

export const getTicketsByCreatedBy = (createdBy) => {
  return axiosInstance.post(`/getTicketsByCreatedBy`, { createdBy })
}
