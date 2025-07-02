

export const getGenerateUserTokenQuery = () => {
    return `
        mutation ($username: String!, $password: String!) {
          generateUserToken(username: $username, password: $password) {
            token
          }
        }
    `;
}