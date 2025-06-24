
import AdminLayout from "layout/admin";
import {useAdminGuard} from "hooks/useAdminGuard";

const AdminDashboard = props => {
    useAdminGuard();

    return (
        <AdminLayout>
            <h1>Hi</h1>
        </AdminLayout>
    );
}

export default AdminDashboard;