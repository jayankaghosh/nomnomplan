import { Routes, Route } from 'react-router-dom';
import Home from 'pages/home';
import Login from 'pages/login';
import NoRoute from 'pages/noroute';
import AdminUserSetPassword from 'pages/admin-user-set-password';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/login" Component={Login} />
            <Route path="/admin/user/setPassword" Component={AdminUserSetPassword} />
            <Route path="*" Component={NoRoute} />
        </Routes>
    );
}

export default AppRouter;