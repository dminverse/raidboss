'use strict'
import util from 'util';
import express from "express";
import ViteExpress from "vite-express";
import cookieSession from 'cookie-session';
import passport from "passport";
import passportTwitchNew from "passport-twitch-new";
const  twitchStrategy = passportTwitchNew.Strategy;

const port = process.env.PORT || 3000;
const cookieSecretKey = process.env.COOKIE_SECRET || 'RaidBoss gives +1 attack to all friendly minions';

const app = express();

// add req.session cookie support
app.use(cookieSession({ secret: cookieSecretKey }));

// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(passport.initialize());
passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/auth/twitch/callback`, // 
    scope: "user_read channel:manage:raids user:read:follows"
  },
  function(accessToken, refreshToken, profile, done) {
	  console.log("Got token " + accessToken + ", " + refreshToken + ", " + util.inspect(profile));
    //User.findOrCreate({ twitchId: profile.id }, function (err, user) {
    //  return done(err, user);
    //});
	return done(null, {accessToken: accessToken, refreshToken: refreshToken, profile: profile, clientId: process.env.TWITCH_CLIENT_ID});
  }
));

app.post("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
	console.log("Callback, req " + util.inspect(req.params) + ", " + util.inspect(req.session));
    res.redirect("/");
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/login', (req, res) => {
	console.log("/login, req " + util.inspect(req.params) + ", " + util.inspect(req.session));
  res.send('You want to login to Twitch. <form method="POST" action="/auth/twitch"><input type="submit" value="Login"/></form>')
})

app.post('/login', (req, res) => {
	//req.session.user = 1;
	res.send(' You can access <a href="/restricted">/restricted</a> now.');
})

function restrict(req, res, next) {
	console.log("***** restrict " + util.inspect(req.params) + ", " + util.inspect(req.session));
  if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.profile && req.session.passport.user.profile.id) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
	console.log("/ root: req " + util.inspect(req.params) + ", " + util.inspect(req.session));
  res.redirect('/restricted');
});

app.get('/restricted', restrict, function(req, res){
	console.log("Restricted " + util.inspect(req.params) + ", " + util.inspect(req.session));
  //res.send('Wahoo! You are logged in, <a href="/index.html">click here for the RaidBoss</a>, or click to <a href="/logout">logout</a>. ');
  res.redirect('/index.html');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  /*
  req.session.destroy(function(){
    res.redirect('/');
  });
  */
  req.session = null;
  res.redirect('/');
});
app.post('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  /*
  req.session.destroy(function(){
    res.redirect('/');
  });
  */
  req.session = null;
  res.redirect('/');
});

app.get('/ajax/session', function(req, res){
	if (!req.session || !req.session.passport || !req.session.passport.user)
		res.redirect('/login');
	else
		res.send(req.session.passport.user);
});

app.get("/hello", (req, res) => {
  res.send("Hello Vite + Vue!");
});

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on port ${port}...`),
);
