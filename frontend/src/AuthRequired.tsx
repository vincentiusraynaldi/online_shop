import * as React from 'react';
import { Navigate, useLocation} from 'react-router-dom';
import { useAuth } from './provider/AuthProvider';

export interface AuthRequiredProps {
    to?: string;
    children?: React.ReactNode;
}

export const AuthRequired: React.FC<AuthRequiredProps> = ({
    children,
    to = "/home",
}) => {
    const {isLoggedIn} = useAuth();
    const { pathname } = useLocation();

    if(!isLoggedIn && pathname !== to) {
        return <Navigate to={to} replace />;
    }
    return <>{children}</>;
}