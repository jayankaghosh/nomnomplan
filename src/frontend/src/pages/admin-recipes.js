
import AdminLayout from "layout/admin";
import {useAdminGuard} from "util/hooks";
import AdminGrid from "components/admin-grid";
import {
    _getRecipesQuery, getDeleteRecipeMutation,
    getInsertOrUpdateRecipeMutation,
    getRecipeListQuery
} from "query/admin";
import relativeTime from 'dayjs/plugin/relativeTime';
import {List, ListItem, ListItemText, TextField} from '@mui/material';
import DynamicRowsInput from "components/dynamic-rows-input";
import {toast} from "react-toastify";
import {search} from "util/algolia";
import {formatPrice, getLocalTime, ucwords} from "util/stdlib";

const AdminRecipes = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.name = ucwords(row.name);
        row.cost = formatPrice(row.cost);
        row.created_at = getLocalTime(row.created_at).fromNow();
        row.updated_at = getLocalTime(row.updated_at).fromNow();
        return row;
    }

    const ingredientsRenderer = ingredients => {
        return (
            <List dense>
                {ingredients.map((ingredient) => (
                    <ListItem key={ingredient.id} disablePadding>
                        <ListItemText
                            primary={`• ${ucwords(ingredient.name)} - ${ingredient.qty} ${ingredient.qty_unit}`}
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
                <TextField
                    label="Keywords"
                    name="keywords"
                    multiline
                    minRows={3}
                    maxRows={6}
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['keywords']}
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
                                try {
                                    const hits = await search('ingredient', searchText);
                                    return hits.map(item => {
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
                columns={['id', 'name', 'keywords', 'ingredients', 'cost', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
                columnRenderers={{ ingredients: ingredientsRenderer }}
                AddNewItemForm={AddNewItemForm}
                addNewItemQuery={getInsertOrUpdateRecipeMutation}
                addNewItemQueryName={'adminInsertOrUpdateRecipe'}
                prepareItemData={prepareItemData}
                deleteQuery={getDeleteRecipeMutation}
            />
        </AdminLayout>
    );
}

export default AdminRecipes;