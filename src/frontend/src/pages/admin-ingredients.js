
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";
import AdminGrid from "components/admin-grid";
import {getIngredientListQuery} from "../query/admin";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const AdminIngredients = props => {
    useAdminGuard();

    const rowMutator = row => {
        row.created_at = dayjs(row.created_at).fromNow();
        row.updated_at = dayjs(row.updated_at).fromNow();
        return row;
    }

    return (
        <AdminLayout>
            <AdminGrid
                title={'Ingredient List'}
                query={getIngredientListQuery()}
                queryName={'getIngredients'}
                columns={['id', 'name', 'is_veg', 'qty_unit', 'created_at', 'updated_at']}
                rowMutator={ rowMutator }
            />
        </AdminLayout>
    );
}

export default AdminIngredients;