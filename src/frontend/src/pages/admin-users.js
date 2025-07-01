
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";
import {
    _getUsersQuery,
    getDeleteUserMutation,
    getInsertOrUpdateUserMutation,
    getUserListQuery
} from "../query/admin";
import {TextField} from "@mui/material";
import {getLocalTime} from "util/stdlib";

const AdminUsers = props => {
    useAdminGuard();

    const rowMutator = row => {
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
        return item;
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'User List'}
                query={getUserListQuery}
                innerQuery={_getUsersQuery}
                queryName={'adminGetUsers'}
                columns={['id', 'name', 'email', 'phone', 'created_at', 'updated_at']}
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