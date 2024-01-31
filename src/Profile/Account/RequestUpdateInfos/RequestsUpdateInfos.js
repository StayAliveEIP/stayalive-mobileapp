import { urlApi } from '../../../Utils/Api'

export const requestUpdateEmail = async (profileData, token) => {
  const body = JSON.stringify({
    email: profileData.email.email,
  })
  console.log(`${urlApi}/rescuer/account/change-email`)
  const response = await fetch(`${urlApi}/rescuer/account/change-email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
  if (response.status === 200 || response.status === 201) {
    return true
  } else return false
}

export const requestUpdatePhone = async (profileData, token) => {
  const body = JSON.stringify({
    phone: profileData.phone.phone,
  })
  const response = await fetch(`${urlApi}/rescuer/account/change-phone`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  })
  console.log(response);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
  if (response.status === 200 || response.status === 201) return true
  else return false
}
