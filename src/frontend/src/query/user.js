

export const getGenerateUserTokenQuery = () => {
    return `
        mutation ($username: String!, $password: String!) {
          generateUserToken(username: $username, password: $password) {
            token
          }
        }
    `;
}

export const getRecipeScheduleQuery = () => {
    return `
        query GetRecipeSchedule($from: String!, $to: String!) {
          getRecipeSchedule(from: $from, to: $to) {
            schedule {
              date
              slots {
                slot
                recipes {
                  id
                  cost
                  recipe {
                    id
                    name
                    ingredients {
                        id
                        name
                        qty
                        qty_unit
                        unit_price
                    }
                  }
                  number_of_people
                  created_at
                  updated_at
                }
              }
            }
          }
        }
    `;
}

export const getSetRecipeScheduleMutation = () => {
    return `
        mutation SetRecipeSchedule(
          $recipe_id: Int!,
          $number_of_people: Int!,
          $date: String!,
          $slot: RecipeScheduleSlotEnum!,
          $from: String!,
          $to: String!
        ) {
          setRecipeSchedule(
            recipe_id: $recipe_id,
            number_of_people: $number_of_people,
            date: $date,
            slot: $slot
          ) {
            response: getRecipeSchedule(from: $from, to: $to) {
              schedule {
                date
                slots {
                  id
                  slot
                  recipe {
                    id
                    name
                  }
                  number_of_people
                  created_at
                  updated_at
                }
              }
            }
          }
        }    
    `;
}

export const getDeleteRecipeScheduleMutation = () => {
    return `
        mutation DeleteRecipeSchedule(
          $id: Int!,
          $from: String!,
          $to: String!
        ) {
          deleteRecipeSchedule(
            id: $id
          ) {
            response: getRecipeSchedule(from: $from, to: $to) {
              schedule {
                date
                slots {
                  id
                  slot
                  recipe {
                    id
                    name
                  }
                  number_of_people
                  created_at
                  updated_at
                }
              }
            }
          }
        }    
    `;
}