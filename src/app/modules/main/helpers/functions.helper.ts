export const getToken = (): string => {
  return localStorage.getItem('access-token') || ''
}
