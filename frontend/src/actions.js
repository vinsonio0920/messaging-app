import { redirect } from "react-router";
import { base64ToFile } from "./utils";

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

const signInAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const url = `${import.meta.env.VITE_SERVER_URL}/sign-in`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const result = await response.json();

    if (result.status === "success") {
      const { token, userId } = result.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);

      return redirect("/");
    } else {
      return result;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const chatAction = async ({ request }) => {
  const formData = await request.formData();
  const chatId = formData.get("chatId");
  const url = `${import.meta.env.VITE_SERVER_URL}/chats/${chatId}/create`;

  // turn base64 image to file
  const base64Image = formData.get("image");
  if (typeof base64Image === "string" && base64Image.startsWith("data:")) {
    formData.set("image", await base64ToFile(base64Image));
  }
  // remove unnecessary imageInput field
  formData.delete("imageInput");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      },
      body: formData,
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

const settingsAction = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("userId");
  const url = `${import.meta.env.VITE_SERVER_URL}/users/${userId}`;

  // turn base64 image to file
  const base64Image = formData.get("profile");
  if (typeof base64Image === "string" && base64Image.startsWith("data:")) {
    formData.set("profile", await base64ToFile(base64Image));
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      },
      body: formData,
    });

    const result = await response.json();

    localStorage.removeItem("profileUsername");
    localStorage.removeItem("profileImage");

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

export { signUpAction, signInAction, chatAction, settingsAction };
