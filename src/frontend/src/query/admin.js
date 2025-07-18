

export const _getIngredientsQuery = (variableName) => {
    return `
        adminGetIngredients(input: $${variableName}) {
            currentPage
            pageSize
            totalPages
            totalCount
            items {
              id
              name
              is_veg
              qty_unit
              unit_price
              keywords
              created_at
              updated_at
            }
        }
    `;
}

export const _getRecipesQuery = (variableName) => {
    return `
        adminGetRecipes(input: $${variableName}) {
            currentPage
            pageSize
            totalPages
            totalCount
            items {
              id
              name
              cost
              keywords
              ingredients {
                id
                name
                is_veg
                qty_unit
                unit_price
                qty
                created_at
                updated_at
              }
              created_at
              updated_at
            }
        }
    `;
}

export const _getUsersQuery = (variableName) => {
    return `
        adminGetUsers(input: $${variableName}) {
            currentPage
            pageSize
            totalPages
            totalCount
            items {
              id
              name
              email
              phone
              is_blocked
              created_at
              updated_at
            }
        }
    `;
}

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

export const getIngredientListQuery = (input = 'input', innerQuery = _getIngredientsQuery) => {
    return `
        query ($${input}: PaginatedListInput!) {
            ${innerQuery(input)}
        }      
    `;
}

export const getRecipeListQuery = (input = 'input', innerQuery = _getRecipesQuery) => {
    return `
        query ($${input}: PaginatedListInput!) {
          ${innerQuery(input)}
        }    
    `;
}

export const getUserListQuery = (input = 'input', innerQuery = _getUsersQuery) => {
    return `
        query ($${input}: PaginatedListInput!) {
          ${innerQuery(input)}
        }    
    `;
}

export const getInsertOrUpdateIngredientMutation = (input = 'input', innerQuery = _getIngredientsQuery, innerInput = 'innerInput') => {
    return `
        mutation AdminInsertOrUpdateIngredient(
          $${input}: IngredientInput!
          $${innerInput}: PaginatedListInput!
        ) {
          adminInsertOrUpdateIngredient(input: $${input}) {
            ${innerQuery(innerInput)}
          }
        }
    `;
}

export const getInsertOrUpdateRecipeMutation = (input = 'input', innerQuery = _getRecipesQuery, innerInput = 'innerInput') => {
    return `
        mutation AdminInsertOrUpdateRecipe(
          $${input}: RecipeInput!
          $${innerInput}: PaginatedListInput!
        ) {
          adminInsertOrUpdateRecipe(input: $${input}) {
            ${innerQuery(innerInput)}
          }
        }
    `;
}

export const getInsertOrUpdateUserMutation = (input = 'input', innerQuery = _getUsersQuery, innerInput = 'innerInput') => {
    return `
        mutation AdminInsertOrUpdateUser(
          $${input}: UserInput!
          $${innerInput}: PaginatedListInput!
        ) {
          adminInsertOrUpdateUser(input: $${input}) {
            ${innerQuery(innerInput)}
          }
        }
    `;
}

export const getDeleteIngredientMutation = (innerQuery = _getIngredientsQuery, innerInput = 'innerInput') => {
    return `
        mutation AdminDeleteIngredient(
            $id: Int!
            $${innerInput}: PaginatedListInput!
        ) {
          response: adminDeleteIngredient(id: $id) {
            ${innerQuery(innerInput)}
          }
        }    
    `;
}

export const getDeleteRecipeMutation = (innerQuery = _getRecipesQuery, innerInput = 'innerInput') => {
    return `
        mutation AdminDeleteRecipe(
            $id: Int!
            $${innerInput}: PaginatedListInput!
        ) {
          response: adminDeleteRecipe(id: $id) {
            ${innerQuery(innerInput)}
          }
        }    
    `;
}

export const getDeleteUserMutation = (innerQuery = _getUsersQuery, innerInput = 'innerInput') => {
    return `
        mutation AdminDeleteUser(
            $id: Int!
            $${innerInput}: PaginatedListInput!
        ) {
          response: adminDeleteUser(id: $id) {
            ${innerQuery(innerInput)}
          }
        }    
    `;
}