
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";

const AdminIngredients = props => {
    useAdminGuard();

    return (
        <AdminLayout>
            <AdminGrid
                title={'Ingredient List'}
            />
        </AdminLayout>
    );
}

export default AdminIngredients;