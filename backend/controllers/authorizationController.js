async function getSignUpPage(req, res) {
  req.send("Getting sign up page...");
}

async function postSignUpPage(req, res) {
  req.send("Posting sign up page...");
}

async function getSignInPage(req, res) {
  req.send("Getting sign in page...");
}

async function postSignInPage(req, res) {
  req.send("Posting sign in page...");
}

export { getSignUpPage, postSignUpPage, getSignInPage, postSignInPage };
