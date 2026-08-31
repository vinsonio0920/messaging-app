import { App } from "./App.jsx";
import { Homepage } from "./homepage/Homepage.jsx";
import { SignIn } from "./signUp/SignUp.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignIn />,
  },
];

export { routes };
