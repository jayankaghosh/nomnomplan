

export const isAdminPasswordTokenValidQuery = token => {
    return `
        query ($token: String!) {
          isAdminPasswordTokenValid(token: $token) {
            status
            message
          }
        }
    `;
}

export const getAdminUserSetPasswordQuery = () => {
    return `
        mutation ($token: String!, $password: String!) {
          adminUserSetPassword(token: $token, password: $password) {
            status
            message
          }
        }
    `;
}

export const getGenerateAdminTokenQuery = () => {
    return `
        mutation ($username: String!, $password: String!) {
          generateAdminToken(username: $username, password: $password) {
            token
          }
        }
    `;
}