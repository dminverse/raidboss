<script setup>
import {ref, onMounted } from 'vue';

import User from "./components/User.vue";
import StreamPicker from "./components/StreamPicker.vue";

class UserAuth {
	accessToken;
	refreshToken;
	clientId;
	id;
	login_name;
	display_name;
	
}
const userAuth = ref(null);

async function getSessionUser() {
	const userResponse = await fetch('/ajax/session'); // 
	console.log(userResponse);
	const sessionData = await userResponse.json();
	//loginCode.value = sessionData;
	userAuth.value = sessionData;
	console.log('got userAuth',sessionData);
	//getTwitchUser();
	
}
onMounted( async () => {
	let doTwitchAuthLive = true;
	try {
		if (twitchAuth)
			doTwitchAuthLive = false;
	} catch(exception) {
		// doTwitchAuthLive = true;
	}
	if (doTwitchAuthLive) {
		const userResponse = await fetch('/ajax/session');
		const userVal = await userResponse.json();
		userAuth.value = userVal;
		console.log('fetched', userVal);
	} else {
		console.log("Loaded twitch auth from auth.js");
		userAuth.value = {
			accessToken: twitchAuth.accessToken,
			clientId: twitchAuth.clientId,
		};
	}
})


</script>

<template>
	<div>
	<User :auth="userAuth" /> 
	</div>
  <div style="position:relative;top:200px">
  <a href="/logout">Log out</a></div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
