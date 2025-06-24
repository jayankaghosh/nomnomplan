import { setData, getData } from 'util/local-storage';

const ADMIN_TOKEN_KEY = 'admin_token';
const USER_TOKEN_KEY = 'user_token';
const TOKEN_EXPIRY_HOURS = 24 * 365;

export const setAdminToken = token => setData(ADMIN_TOKEN_KEY, token, TOKEN_EXPIRY_HOURS);
export const setUserToken = token => setData(USER_TOKEN_KEY, token, TOKEN_EXPIRY_HOURS);
export const getAdminToken = () => getData(ADMIN_TOKEN_KEY);
export const getUserToken = () => getData(USER_TOKEN_KEY);