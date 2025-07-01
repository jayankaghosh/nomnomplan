
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";
import {
    _getIngredientsQuery,
    getDeleteIngredientMutation,
    getIngredientListQuery,
    getInsertOrUpdateIngredientMutation
} from "../query/admin";
import {TextField, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import {formatPrice, getLocalTime, ucwords} from "util/stdlib";
import {getIngredientQtyUnits} from "util/config";

const AdminIngredients = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.is_veg = row.is_veg === '1' ? 'Yes' : 'No';
        row.unit_price = formatPrice(row.unit_price);
        row.name = ucwords(row.name);
        row.created_at = getLocalTime(row.created_at).fromNow();
        row.updated_at = getLocalTime(row.updated_at).fromNow();
        return row;
    }

    const AddNewItemForm = ({ formValues }) => {
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
                <FormControl fullWidth margin="normal">
                    <InputLabel>Is Veg *</InputLabel>
                    <Select
                        label="Is Veg"
                        name='is_veg'
                        defaultValue={formValues['is_veg']}
                        required
                    >
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="0">No</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Qty Unit *</InputLabel>
                    <Select
                        label="Qty Unit"
                        name='qty_unit'
                        defaultValue={formValues['qty_unit']}
                        required
                    >
                        {
                            getIngredientQtyUnits().map(item => {
                                return (
                                    <MenuItem value={item}>{item}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <TextField
                    label="Unit Price"
                    type={'number'}
                    name='unit_price'
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['unit_price']}
                    required
                    inputProps={{ step: "0.01" }}
                />
            </>
        )
    }

    const prepareItemData = item => {
        item.is_veg = item.is_veg === '1';
        item.unit_price = parseFloat(item.unit_price);
        return item;
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'Ingredient List'}
                query={getIngredientListQuery}
                innerQuery={_getIngredientsQuery}
                queryName={'adminGetIngredients'}
                columns={['id', 'name', 'is_veg', 'qty_unit', 'unit_price', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
                AddNewItemForm={AddNewItemForm}
                addNewItemQuery={getInsertOrUpdateIngredientMutation}
                addNewItemQueryName={'adminInsertOrUpdateIngredient'}
                prepareItemData={prepareItemData}
                deleteQuery={getDeleteIngredientMutation}
            />
        </AdminLayout>
    );
}

export default AdminIngredients;