import axiosInstance from './axios'

export const addTicket = (data) => {
  return axiosInstance.post(`/restreamdesk/addTicket`, data)
}

export const getGroups = () => {
  return axiosInstance.get(`/restreamdesk/getGroups`)
}

export const getGroupTickets = (groupId) => {
  return axiosInstance.post(`/restreamdesk/getGroupTickets`, { groupId })
}

export const getTicketsByCreatedBy = (createdBy) => {
  return axiosInstance.post(`/restreamdesk/getTicketsByCreatedBy`, { createdBy })
}

export const getUserTickets = () => {
  return axiosInstance.get(`/restreamdesk/getUserTickets`)
}

export const login = ({ email, password }) => {
  return axiosInstance.post(`/backoffice/login`, {
    email,
    password,
    _nosr: 1,
    // "_gcet":"ojoj"
    _nocp: 1,
    // ,   "_devm":1
  })
}
