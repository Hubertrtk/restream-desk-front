function buildSessionString(data) {
  if (!data || !data.id || !data.token || !data.pk || !data.dt) {
    throw new Error('Brakuje wymaganych pól w obiekcie!')
  }

  return `${data.id}.${data.token}.${data.pk}.${data.dt}`
}
export default buildSessionString
