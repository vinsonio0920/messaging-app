import { redirect } from "react-router";

const appLoader = async () => {
  // Checks if the user is signed in
  const checkUrl = `${import.meta.env.VITE_SERVER_URL}/check-authentication`;
  const jwtToken = localStorage.getItem("jwtToken");

  const checkResponse = await fetch(checkUrl, {
    method: "POST",
    body: new URLSearchParams({
      jwtToken: jwtToken,
    }),
  });

  const checkResult = await checkResponse.json();

  // if jwtToken is not valid, redirect user to the sign up page
  if (!checkResult) return redirect("/sign-in");

  // return the user info (excluding password)
  const userId = localStorage.getItem("userId");
  if (!userId) return redirect("/sign-in");

  const userUrl = `${import.meta.env.VITE_SERVER_URL}/users/${userId}/info`;

  const userResponse = await fetch(userUrl, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("jwtToken"),
    },
  });

  const userResult = await userResponse.json();

  return {
    user: userResult.data,
  };
};

export { appLoader };
