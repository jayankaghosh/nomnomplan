import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {getAdminToken, getUserToken, setAdminToken, setUserToken} from "util/auth";
import {ADMIN_LOGIN, LOGIN} from "pages/routes.config";

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

export const useUserGuard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getUserToken();
        if (!token) {
            setUserToken(null);
            navigate(LOGIN);
        }
    }, [navigate]);
};