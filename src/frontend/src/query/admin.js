

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

export const getIngredientListQuery = () => {
    return `
        query ($input: PaginatedListInput!) {
          adminGetIngredients(input: $input) {
            currentPage
            pageSize
            totalPages
            totalCount
            items {
              id
              name
              is_veg
              qty_unit
              created_at
              updated_at
            }
          }
        }    
    `;
}

export const getRecipeListQuery = () => {
    return `
        query ($input: PaginatedListInput!) {
          adminGetRecipes(input: $input) {
            currentPage
            pageSize
            totalPages
            totalCount
            items {
              id
              name
              ingredients {
                id
                name
                is_veg
                qty_unit
                qty
                created_at
                updated_at
              }
              created_at
              updated_at
            }
          }
        }    
    `;
}