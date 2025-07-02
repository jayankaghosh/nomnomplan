import { Routes, Route } from 'react-router-dom';
import Home from 'pages/home';
import Login from 'pages/login';
import Schedule from 'pages/schedule';
import NoRoute from 'pages/noroute';
import AdminSetPassword from 'pages/admin-set-password';
import AdminLogin from 'pages/admin-login';
import AdminDashboard from 'pages/admin-dashboard';
import AdminIngredients from 'pages/admin-ingredients';
import AdminNoRoute from 'pages/admin-noroute';
import AdminRecipes from "pages/admin-recipes";
import {
    ADMIN_DASHBOARD,
    ADMIN_INGREDIENTS,
    ADMIN_LOGIN,
    ADMIN_RECIPES,
    ADMIN_SET_PASSWORD,
    ADMIN_USERS,
    HOME,
    LOGIN, SCHEDULE
} from "pages/routes.config";
import AdminUsers from "./admin-users";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={HOME} exact Component={Home} />
            <Route path={LOGIN} Component={Login} />
            <Route path={SCHEDULE} Component={Schedule} />
            <Route path={ADMIN_LOGIN} Component={AdminLogin} />
            <Route path={ADMIN_SET_PASSWORD} Component={AdminSetPassword} />
            <Route path={ADMIN_DASHBOARD} Component={AdminDashboard} />
            <Route path={ADMIN_INGREDIENTS} Component={AdminIngredients} />
            <Route path={ADMIN_RECIPES} Component={AdminRecipes} />
            <Route path={ADMIN_USERS} Component={AdminUsers} />
            <Route path={`${ADMIN_DASHBOARD}/*`} Component={AdminNoRoute} />
            <Route path="*" Component={NoRoute} />
        </Routes>
    );
}

export default AppRouter;