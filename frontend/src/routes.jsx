import {
  chatAction,
  settingsAction,
  signInAction,
  signUpAction,
} from "./actions.js";
import { App } from "./App.jsx";
import { Chat } from "./chat/Chat.jsx";
import { ErrorPage } from "./errorPage/errorPage.jsx";
import { Homepage } from "./homepage/Homepage.jsx";
import { Settings } from "./settings/Settings.jsx";
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
      {
        path: "/chats/:chatId",
        element: <Chat />,
        action: chatAction,
      },
      {
        path: "/settings",
        element: <Settings />,
        action: settingsAction,
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
    action: signInAction,
  },
];

export { routes };
