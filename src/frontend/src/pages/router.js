import { Routes, Route } from 'react-router-dom';
import Home from 'pages/home';
import Login from 'pages/login';
import NoRoute from 'pages/noroute';
import AdminSetPassword from 'pages/admin-set-password';
import AdminLogin from 'pages/admin-login';
import AdminDashboard from 'pages/admin-dashboard';
import {ADMIN_DASHBOARD, ADMIN_LOGIN, ADMIN_SET_PASSWORD, HOME, LOGIN} from "pages/routes.config";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={HOME} exact Component={Home} />
            <Route path={LOGIN} Component={Login} />
            <Route path={ADMIN_LOGIN} Component={AdminLogin} />
            <Route path={ADMIN_SET_PASSWORD} Component={AdminSetPassword} />
            <Route path={ADMIN_DASHBOARD} Component={AdminDashboard} />
            <Route path="*" Component={NoRoute} />
        </Routes>
    );
}

export default AppRouter;