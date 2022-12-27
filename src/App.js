import React, { useState, useEffect, useCallback, Suspense } from "react";
// npm i --save react-router-dom@5 --save-exact
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
//import NewPlace from "./places/pages/NewPlace";
//import UpdatePlace from "./places/pages/UpdatePlace";
//import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner/LoadingSpinner";
//import Login from "./user/pages/Login";

//import Register from "./user/pages/Register";
//import Users from "./user/pages/Users";
import { AuthContext } from "./shared/context/auth-context";

// for lazy loading
// כדי שלא יטען את כל האפליקציה בכל פעם שנפתח את האתר
// עושים import למשתמשים רק כשהם יצטרכו להיות במסך
// במקום ה import הרגיל
// עובד רק עם router
const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const Login = React.lazy(() => import("./user/pages/Login"));
const Register = React.lazy(() => import("./user/pages/Register"));

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  const register = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token })
    );
  }, []);

  // כדי שלא נצטרך להתחבר מחדש בכל פעם שנפתח את האפליקציה
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
  }, [login, register]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        {/* אם הכניסו משהו שאינו קיים באתר, נפנה אותם לדף הראשי */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth/login" exact>
          <Login />
        </Route>
        <Route path="/auth/register" exact>
          <Register />
        </Route>
        {/* אם הכניסו משהו שאינו קיים באתר, נפנה אותם לדף הראשי */}
        <Redirect to="/auth/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        register: register,
      }}
    >
      {/* Suspense - lazy loading
      כדי שלא יטען את כל האפליקציה בכל פעם שנפתח את האתר
      fallback - כאשר האפליקציה עדיין לא נטענה */}
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner />
                </div>
              }
            >
              {routes}
            </Suspense>
          </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
