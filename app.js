const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.set("partials", path.join(__dirname, "partials"));
const { auth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "ac9676181de97f762aa8ef3a26cbfcc771de2bf65265cf403f4346875e4aa267ly",
  baseURL: externalUrl || "http://localhost:3000",
  clientID: "YiHLZgcqVenvLVXiZSgwdnPi7vgau02x",
  issuerBaseURL: "https://dev-b5iqijw0brv5hnr1.us.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
const results = [
  {
    id: "1",
    host: "Bills",
    guest: "Rams",
    date: "22.03.2022",
    result: "3:1",
  },
  {
    id: "2",
    host: "Saints",
    guest: "Falcons",
    date: "25.03.2022",
    result: "3:1",
  },
  {
    id: "3",
    host: "Browns",
    guest: "Panthers",
    date: "09.04.2022",
    result: "3:1",
  },
  {
    id: "4",
    host: "Ravens",
    guest: "Buccaneers",
    date: "28.08.2022",
    result: "4:3",
  },
  {
    id: "5",
    host: "Buccaneers",
    guest: "Ravens",
    date: "22.08.2022",
    result: "1:2",
  },
];

const comments = [
  {
    userMail: "user",
    date: "2022-09-12",
    text: "Will the Falcons cover vs. the Panthers at home?",
  },
  {
    userMail: "user2",
    date: "2022-9-13",
    text: "1st place Vikings!",
  },
  {
    userMail: "user",
    date: "2022-10-28",
    text: "Who is the season leader?",
  },
];
// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    currentUser = JSON.stringify(req.oidc.user.nickname);
    if (currentUser === '"admin"') {
      res.render("admin.ejs", {
        currentUser: currentUser,
        results: results,
        comments: comments,
      });
    } else if (currentUser === '"user"' || currentUser === '"user2"') {
      console.log(typeof comments);
      res.render("user.ejs", {
        currentUser: currentUser,
        results: results,
        comments: comments,
      });
    }
  } else {
    res.render("anon.ejs", {
      currentUser: "anonimus",
      results: results,
      comments: comments,
    });
  }
});

app.post("/comment", urlencodedParser, (req, res) => {
  console.log(req.body);
  const date = new Date().toJSON().slice(0, 10);
  currentUser = JSON.stringify(req.oidc.user.nickname);
  comments.push({
    userNickname: req.oidc.user.nickname,
    date: date,
    text: req.body.userComment,
  });

  if (currentUser === '"admin"') {
    res.redirect("/");
  } else if (currentUser === '"user"' || currentUser === '"user2"') {
    res.redirect("/");
  }
});

app.post("/result", urlencodedParser, (req, res) => {
  currentUser = JSON.stringify(req.oidc.user.nickname);
  console.log(req.body.adminUpdate1);
  results.push({
    id: req.body.adminUpdate1,
    host: req.body.adminUpdate2,
    guest: req.body.adminUpdate3,
    date: req.body.adminUpdate4,
    result: req.body.adminUpdate5,
  });
  if (currentUser === '"admin"') {
    res.redirect("/");
  } else if (currentUser === '"user"' || currentUser === '"user2"') {
    console.log(typeof comments);
    res.render("/");
  }
});
function findId(adminInput) {
  return result.id === adminInput;
}
app.post("/result/:id", urlencodedParser, (req, res) => {
  //res.send("user", req.params);
  currentUser = JSON.stringify(req.oidc.user.nickname);
  console.log(req.body.adminDelete);
  const { id } = req.body.adminDelete;

  const deletedIndex = results[req.body.adminDelete + 1];
  results.splice(req.body.adminDelete - 1, 1);
  if (currentUser === '"admin"') {
    res.redirect("/");
  } else if (currentUser === '"user"' || currentUser === '"user2"') {
    console.log(typeof comments);
    res.redirect("/");
  }
});

const { requiresAuth } = require("express-openid-connect");
const { hostname } = require("os");

app.get("/profile", requiresAuth(), (req, res) => {
  //res.send(JSON.stringify(req.oidc.user.nickname));
  let user = JSON.stringify(req.oidc.user);
  res.send(user);
});

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = process.env.PORT || 3000;
if (externalUrl) {
  app.listen(port, hostname, () => {
    console.log(
      `Server locally running at http://${hostname}:${port}/ and from outside on &{externalUrl}`
    );
  });
} else {
  app.listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
  });
}
