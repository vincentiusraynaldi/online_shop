import { 
    Navigate, 
    RouteProps, 
    Routes, 
    Route 
} from "react-router-dom";

import { 
    LoginPage,
    RegisterPage 
} from "./pages";

export type RouteConfig = RouteProps & { 
    path: string;
    isPrivate: boolean;
}

export const routes: RouteConfig[] = [
    {
        path: "/",
        isPrivate: false,
        element: <Navigate to="/home" replace /> 
    },
    {
        path: "/home",
        isPrivate: false,
        element: <h1>Home</h1>
    },
    {
        path: "/login",
        isPrivate: false,
        element: <LoginPage/>
    },
    {
        path: "/register",
        isPrivate: false,
        element: <RegisterPage/>
    }
]

export function renderRouteMap({
    isPrivate,
    element,
    ...restRoute
  }: RouteConfig) {
    return <Route key={restRoute.path} {...restRoute} element={element}/>;
}

const AppRoutes = () => {
    return <Routes>{routes.map(renderRouteMap)}</Routes>
}

export default AppRoutes