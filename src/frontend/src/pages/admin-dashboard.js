
import AdminLayout from "layout/admin";
import {useAdminGuard} from "util/hooks";

const AdminDashboard = props => {
    useAdminGuard();

    return (
        <AdminLayout>
            <h1>Hi Indu :)</h1>
        </AdminLayout>
    );
}

export default AdminDashboard;