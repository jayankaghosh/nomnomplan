
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";
import {
    _getRecipesQuery,
    getIngredientListQuery,
    getInsertOrUpdateRecipeMutation,
    getRecipeListQuery
} from "query/admin";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {List, ListItem, ListItemText, TextField} from '@mui/material';
import DynamicRowsInput from "components/dynamic-rows-input";
import {fetchData} from "util/api";
import {toast} from "react-toastify";

dayjs.extend(relativeTime);

const AdminRecipes = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.created_at = dayjs(row.created_at).fromNow();
        row.updated_at = dayjs(row.updated_at).fromNow();
        return row;
    }

    const ingredientsRenderer = ingredients => {
        return (
            <List dense>
                {ingredients.map((ingredient) => (
                    <ListItem key={ingredient.id} disablePadding>
                        <ListItemText
                            primary={`• ${ingredient.name} - ${ingredient.qty} ${ingredient.qty_unit}`}
                            sx={{ ml: 1 }}
                        />
                    </ListItem>
                ))}
            </List>
        );
    }

    const AddNewItemForm = ({ formValues }) => {

        const prepareIngredientLabel = ingredient => `${ingredient.name} (${ingredient.qty_unit})`

        const initialIngredientRows = [];
        const initialIngredientOptions = [];
        if (formValues.ingredients) {
            formValues.ingredients.forEach(ingredient => {
                initialIngredientRows.push({
                    qty: ingredient.qty,
                    id: ingredient.id
                });
                initialIngredientOptions.push({
                    label: prepareIngredientLabel(ingredient),
                    value: ingredient.id
                });
            });
        }
        return (
            <>
                <TextField
                    label="Name"
                    type={'text'}
                    name='name'
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['name']}
                    required
                />
                <DynamicRowsInput
                    initialRows={initialIngredientRows}
                    title={'Ingredients'}
                    name={'ingredients'}
                    columns={[
                        {
                            name: 'id',
                            label: 'Ingredient',
                            type: 'async-select',
                            initialOptions: initialIngredientOptions,
                            fetchOptions: async (searchText) => {
                                const variables = {
                                    input: {
                                        filterGroups: [
                                            {
                                                type: "AND",
                                                filters: [
                                                    {
                                                        field: 'name',
                                                        condition: 'LIKE',
                                                        value: `%${searchText.toLowerCase()}%`
                                                    }
                                                ]
                                            }
                                        ],
                                        pageSize: 10,
                                        currentPage: 1,
                                        sort: [
                                            {
                                                field: 'id',
                                                direction: 'ASC'
                                            }
                                        ]
                                    }
                                }
                                try {
                                    const {adminGetIngredients: response} = await fetchData(
                                        getIngredientListQuery(),
                                        variables,
                                        'AdminGetIngredients'
                                    );
                                    return response.items.map(item => {
                                        return {
                                            value: item.id,
                                            label: prepareIngredientLabel(item)
                                        }
                                    });
                                } catch ({ category, message }) {
                                    if (category === 'aborted') return;
                                    toast.error(message);
                                }
                                return [];
                            }
                        },
                        {
                            name: 'qty',
                            label: 'Qty',
                            type: 'number'
                        }
                    ]}
                />
            </>
        )
    }

    const prepareItemData = item => {
        item.ingredients = JSON.parse(item.ingredients).filter(i => i.id && i.qty).map(i => {
            i.id = parseInt(i.id);
            i.qty = parseFloat(i.qty);
            return i;
        });
        return item;
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'Recipe List'}
                query={getRecipeListQuery}
                innerQuery={_getRecipesQuery}
                queryName={'adminGetRecipes'}
                columns={['id', 'name', 'ingredients', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
                columnRenderers={{ ingredients: ingredientsRenderer }}
                AddNewItemForm={AddNewItemForm}
                addNewItemQuery={getInsertOrUpdateRecipeMutation}
                addNewItemQueryName={'adminInsertOrUpdateRecipe'}
                prepareItemData={prepareItemData}
            />
        </AdminLayout>
    );
}

export default AdminRecipes;