import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({ children }) {
  UserProvider.propTypes = {
    children: PropTypes.object.isRequired,
  }
  const [token, setToken] = useState(null)

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}
