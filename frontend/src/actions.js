import { redirect } from "react-router";

const signUpAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const url = `${import.meta.env.VITE_SERVER_URL}/sign-up`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const result = await response.json();
    if (result.status === "success") {
      // automatically sign in user for convenience
      const signInUrl = `${import.meta.env.VITE_SERVER_URL}/sign-in`;

      const response = await fetch(signInUrl, {
        method: "POST",
        body: new URLSearchParams({
          email: formData.email,
          password: formData.password,
        }),
      });

      const signInResult = await response.json();

      if (signInResult.status === "success") {
        const token = signInResult.data.token;
        localStorage.setItem("jwtToken", token);

        return redirect("/");
      } else {
        // sign in failed, so users will have to do it manually
        return redirect("/sign-in");
      }
    } else {
      console.log(result);
      return result;
    }
  } catch (error) {
    console.error(error.message);
  }
};

export { signUpAction };
