// hooks/useAdminGuard.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {getAdminToken, setAdminToken} from "util/auth";
import {ADMIN_LOGIN} from "../pages/routes.config";

export const useAdminGuard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAdminToken();
        if (!token) {
            setAdminToken(null);
            navigate(ADMIN_LOGIN);
        }
    }, [navigate]);
};
