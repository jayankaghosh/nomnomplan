
import AdminLayout from "layout/admin";
import {useAdminGuard} from "util/hooks";
import AdminGrid from "components/admin-grid";
import {
    _getUsersQuery,
    getDeleteUserMutation,
    getInsertOrUpdateUserMutation,
    getUserListQuery
} from "query/admin";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {getLocalTime} from "util/stdlib";

const AdminUsers = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.is_blocked = row.is_blocked === '1' ? 'Yes' : 'No';
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
                <TextField
                    label="Email"
                    type={'email'}
                    name='email'
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['email']}
                    required
                />
                <TextField
                    label="Phone"
                    type={'text'}
                    name='phone'
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['phone']}
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Is Blocked *</InputLabel>
                    <Select
                        label="Is Blocked"
                        name='is_blocked'
                        defaultValue={formValues['is_blocked']}
                        required
                    >
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="0">No</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Password"
                    type={'password'}
                    name='password'
                    fullWidth
                    margin="normal"
                    defaultValue={formValues['password']}
                />
            </>
        )
    }

    const prepareItemData = item => {
        item.is_blocked = item.is_blocked === '1';
        return item;
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'User List'}
                query={getUserListQuery}
                innerQuery={_getUsersQuery}
                queryName={'adminGetUsers'}
                columns={['id', 'name', 'email', 'phone', 'is_blocked', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
                AddNewItemForm={AddNewItemForm}
                addNewItemQuery={getInsertOrUpdateUserMutation}
                addNewItemQueryName={'adminInsertOrUpdateUser'}
                prepareItemData={prepareItemData}
                deleteQuery={getDeleteUserMutation}
            />
        </AdminLayout>
    );
}

export default AdminUsers;