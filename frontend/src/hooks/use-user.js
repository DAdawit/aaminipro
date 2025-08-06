// src/hooks/useUser.js
import { useDispatch, useSelector } from 'react-redux';
import { logOut, setCredentials } from '../store/features/user-slice';

const useUser = () => {
    const dispatch = useDispatch();
    // get user state
    const user = useSelector((state) => state.user);

    // set credentials
    const login = ({ email, role, token }) => {
        dispatch(setCredentials({ email, role, token }));
    };

    // logout
    const logout = () => {
        dispatch(logOut());
        sessionStorage.removeItem('token')
    };
    // check is login or not
    const isAuthenticated = !!sessionStorage.getItem('token');

    return {
        user,
        login,
        logout,
        isAuthenticated,
    };
};
// export the hook
export default useUser;
