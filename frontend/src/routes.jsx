import { signUpAction } from "./actions.js";
import { App } from "./App.jsx";
import { ErrorPage } from "./errorPage/errorPage.jsx";
import { Homepage } from "./homepage/Homepage.jsx";
import { SignIn } from "./signIn/SignIn.jsx";
import { SignUp } from "./signUp/SignUp.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    action: signUpAction,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
];

export { routes };
