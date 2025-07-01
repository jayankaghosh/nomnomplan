
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";
import {_getIngredientsQuery, getIngredientListQuery, getInsertOrUpdateIngredientMutation} from "../query/admin";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {TextField, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
dayjs.extend(relativeTime);

const AdminIngredients = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.is_veg = row.is_veg === '1' ? 'Yes' : 'No';
        row.created_at = dayjs(row.created_at).fromNow();
        row.updated_at = dayjs(row.updated_at).fromNow();
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
                <TextField
                    label="Qty Unit"
                    type={'text'}
                    name='qty_unit'
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['qty_unit']}
                    required
                />
            </>
        )
    }

    const prepareItemData = item => {
        item.is_veg = item.is_veg === '1';
        return item;
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'Ingredient List'}
                query={getIngredientListQuery}
                innerQuery={_getIngredientsQuery}
                queryName={'adminGetIngredients'}
                columns={['id', 'name', 'is_veg', 'qty_unit', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
                AddNewItemForm={AddNewItemForm}
                addNewItemQuery={getInsertOrUpdateIngredientMutation}
                addNewItemQueryName={'adminInsertOrUpdateIngredient'}
                prepareItemData={prepareItemData}
            />
        </AdminLayout>
    );
}

export default AdminIngredients;