<script setup>
import { ref, onMounted, watch } from 'vue';
import StreamPicker from "./StreamPicker.vue";

const myUser = ref(null);
const loginCode = ref(null);

const props = defineProps([
  'auth',
]);

const errMsg = ref(null);

function getTwitchUser() {
	const auth = loginCode.value;
	console.log("Getting twitch user for", auth);
	console.log("Token", auth.accessToken);
	fetch('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: 'Bearer ' + auth.accessToken,
        'Client-Id': auth.clientId,
      },
    })
    .then(async (response) => {
		console.log("Got response for user");
      let data = await response.json();
	  console.log(data);
	  if (!loginCode.value.profile){
		let tempVal = loginCode.value;
		tempVal.profile = data.data[0];
		loginCode.value = tempVal;
	  }
	  myUser.value = data.data[0];
	  console.log(myUser.value);
    })
    .catch((error) => {
      // handle error
      console.log('ERROR getting the user:',error);
      errMsg.value = error.message;
    });
	console.log("Sent fetch for user");
}



watch(()=>props.auth, ()=> {
	console.log('watch got new auth', props.auth);
	loginCode.value = props.auth;
	getTwitchUser();
});




</script>
<template>
<div v-if="myUser">
RaidBoss DEV user: {{myUser.display_name}}<br/><img :src="myUser.profile_image_url" alt="Profile" height="200" width="300"/>
<StreamPicker :auth="loginCode"/>
</div>
<div v-else>Loading...</div>
<div v-if="errMsg" style="color: red; font-weight:bold">{{errMsg}}. You may need to try <a href='/logout'>logging out</a> to refresh your token.</div>
</template>