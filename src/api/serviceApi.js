import axiosInstance from './axios'

export const addTicket = (data) => {
  return axiosInstance.post(`/restreamdesk/addTicket`, data)
}

export const getGroups = () => {
  return axiosInstance.post(`/restreamdesk/getGroups`)
}

export const getGroupTickets = (groupId) => {
  return axiosInstance.post(`/restreamdesk/getGroupTickets`, { groupId })
}

export const getTicketsByCreatedBy = (createdBy) => {
  return axiosInstance.post(`/restreamdesk/getTicketsByCreatedBy`, { createdBy })
}

export const getUserTickets = () => {
  return axiosInstance.post(`/restreamdesk/getUserTickets`)
}

export const closeTicketsGroup = ({ url }) => {
  return axiosInstance.post(`/restreamdesk/closeUrl`, { url })
}

export const login = ({ email, password }) => {
  return axiosInstance.post(`/users/login?_lh=P493zNAohB87nrwT`, {
    email,
    password,
    _nosr: 1,
    // "_gcet":"ojoj"
    _nocp: 1,
    // ,   "_devm":1
  })
}
