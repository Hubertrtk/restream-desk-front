const getAuth = () => {
  let auth = localStorage.getItem('rdauthuser')
  const { userName, password } = JSON.parse(auth)
  //   if (userName && password) {
  //     const raw = `${userName}:${password}`
  //     const encoded = btoa(raw) // base64 encode
  //     return `Basic ${encoded}`
  //   }

  return userName
}
export default getAuth
