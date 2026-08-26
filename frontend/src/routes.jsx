import { App } from "./App.jsx";
import { Homepage } from "./homepage/Homepage.jsx";

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
];

export { routes };
