import { 
    Navigate, 
    RouteProps, 
    Routes, 
    Route 
} from "react-router-dom";

import { 
    LoginPage,
    RegisterPage, 
    UserProfilePage
} from "./pages";

import { AuthRequired } from "./AuthRequired";
import ProductPage from "./pages/ProductPage";

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
        path: "/auth/login",
        isPrivate: false,
        element: <LoginPage/>
    },
    {
        path: "/auth/register",
        isPrivate: false,
        element: <RegisterPage/>
    },
    {
        path: "/users/profile",
        isPrivate: true,
        element: <UserProfilePage/>
    },
    {
        path: "/test",
        isPrivate: true,
        element: <h1>test</h1>
    },
        {
        path: "/product",
        isPrivate: false,
        element: <ProductPage/>
    },
]

export function renderRouteMap({
    isPrivate,
    element,
    ...restRoute
  }: RouteConfig) {
    const authRequiredElement = isPrivate ? (
        <AuthRequired>{element}</AuthRequired>
      ) : (
        element
      );
      return <Route key={restRoute.path} {...restRoute} element={authRequiredElement} />;
}

const AppRoutes = () => {
    return <Routes>{routes.map(renderRouteMap)}</Routes>
}

export default AppRoutes