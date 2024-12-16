# raidboss
Twitch raid helper JavaScript Vue app

# Purpose
Have you ever been streaming on Twitch, get to the end of your stream, and want to end the session by sending your viewers to raid a friend?
But then, which friend do you send them to? And you have to pick one who is actually online at the time. It can be a pain!

So I created this tool to help! It will get the list of streamers you follow who are online, and randomly pick one to raid! It even does a fancy loop through the thumbnail images of each one while it decides,
like a spinning roulette wheel, before it finally stops on one stream.

# Support
If you find this tool to be useful, I have a small favor to ask! Please go follow my stream at [https://www.twitch.tv/dminverse](https://www.twitch.tv/dminverse) because I'm close to the 50 followers that I need in order to become
an Affiliate and get access to emotes for my followers! I often do co-working streams with fantasy RPG music in the background, and as of writing, today I coded up this tool while on stream.

And you are under no obligation, but if you really enjoy this tool and want to see it developed further, check out my privacy-friendly wishlist on [https://www.throne.com/dminverse](https://www.throne.com/dminverse) because my headset recently broke and one earpiece is dangling by the wire!

# Script Setup
You will need to login to the Twitch API, see [https://dev.twitch.tv/docs/authentication/#user-access-tokens](https://dev.twitch.tv/docs/authentication/#user-access-tokens) on how to get a User Access Token. Create an App, get your clientId, and get logged in to get a token. Then paste your clientId and token value into the auth.js file. Make sure to run npm and fetch the dependency libraries. Then, you can add the index.html file as your browser source in OBS. Use Interact from the popup menu so that you can click on the Load Channels button in the page, and watch the fun!
