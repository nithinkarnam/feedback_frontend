const TOKEN_KEY = 'jwt_token'
const USER_INFO = 'user_info'

export function saveToken(token){
  localStorage.setItem(TOKEN_KEY, token)
}
export function getToken(){
  return localStorage.getItem(TOKEN_KEY)
}
export function removeToken(){
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_INFO)
}
export function saveUserInfo(info){
  localStorage.setItem(USER_INFO, JSON.stringify(info))
}
export function getUserInfo(){
  const v = localStorage.getItem(USER_INFO)
  return v ? JSON.parse(v) : null
}
