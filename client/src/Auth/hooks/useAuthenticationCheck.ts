import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../store";
import { serverRequest } from "../../utils/serverRequest";
import { setIsAuthenticated, setUserData } from "../userSlice";

export function useAuthenticationCheck(isAuthenticated: boolean) {
    const dispatch = useAppDispatch();
    const [isChecking, setIsChecking] = useState(true);
    const checkAuthentication = useCallback(async () => {
        const response = await serverRequest('/users/refresh');
        const result = response.result;
        if (response.ok) {
            dispatch(setIsAuthenticated(true));
            dispatch(setUserData(result.userData));
            localStorage.setItem('accessToken', result.accessToken);
        } else {
            const errorMessage = result.message;
            console.log('Initial authentication check failed: ' + errorMessage);
        }
        setIsChecking(false);
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated && localStorage.getItem('accessToken')) {
            // console.log("checkAuthentication();");
            checkAuthentication();// asynchronous call
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, checkAuthentication]);
    return isChecking;
}


