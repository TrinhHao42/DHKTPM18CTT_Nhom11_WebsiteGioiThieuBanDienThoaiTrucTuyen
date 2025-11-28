export interface UserInfo {
  userId: number
  userName: string
  userEmail: string
  userAddress: string[]
}

/**
 * Get user information from localStorage
 * @returns UserInfo if user is logged in, null otherwise
 */
export const getUserFromLocalStorage = (): UserInfo | null => {
  if (typeof window === 'undefined') return null

  try {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const parsed = JSON.parse(userJson)
      const userId = parsed?.userId ?? parsed?.id
      const userName = parsed?.userName ?? parsed?.username ?? parsed?.name
      const userEmail = parsed?.userEmail ?? parsed?.email
      const userAddress = parsed?.userAddress ?? parsed?.address ?? []

      if (!userId || !userName || !userEmail) {
      } else {
        return {
          userId: Number(userId),
          userName,
          userEmail,
          userAddress: Array.isArray(userAddress) ? userAddress : []
        }
      }
    }

    const userIdStr = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    const userEmail = localStorage.getItem('userEmail')
    const userAddress = localStorage.getItem('userAddress')

    if (!userIdStr || !userName || !userEmail) {
      return null
    }

    return {
      userId: parseInt(userIdStr),
      userName,
      userEmail,
      userAddress: userAddress ? JSON.parse(userAddress) : []
    }
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  return getUserFromLocalStorage() !== null
}