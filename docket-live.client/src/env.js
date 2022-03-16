export const dev = window.location.origin.includes('localhost')
export const baseURL = dev ? 'http://localhost:3000' : ''
export const useSockets = true
export const domain = 'bcw-harrisonw.us.auth0.com'
export const audience = 'https://docket.live'
export const clientId = '84H2EOKMdiUORLIwU0P6xXUekmUMUlbF'
