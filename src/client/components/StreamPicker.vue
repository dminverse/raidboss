<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps([
  'auth',
]);

const errMsg = ref(null);
const channels = ref(null);
const showChannel = ref(0);
const raidChanNum = ref(null);

onMounted( async () => {
	const uid = props.auth.profile.id;
	console.log("Getting channels for user", uid);
	let channelsResponse;
	try {
		channelsResponse = await fetch('https://api.twitch.tv/helix/streams/followed?user_id=' + uid, {
		  headers: {
			Authorization: 'Bearer ' + props.auth.accessToken,
			'Client-Id': props.auth.clientId,
		  },
		});
		const channelJson = await channelsResponse.json();
		console.log("Got streams response:", channelJson.data);
		channels.value = channelJson.data;
		console.log("There are channels x", channelJson.data.length);
		nextTick( () => {
			const imgid = channelJson.data[0].user_id;
			const showImg = document.getElementById(imgid);
			showImg.style['z-index'] = 2;
			console.log("Showing",channelJson.data[0].user_login, imgid, showImg, showImg.style['z-index']);
		});
	} catch(error) {
		errorText = "Error fetching streams:";
		console.log(errorText, error, channelsResponse);
		errMsg.value = errorText + ' ' + error.message;
	}
});

function randomize() {
	let picked = Math.floor( Math.random() * channels.value.length);
	raidChanNum.value = picked;
	console.log("Picked",picked, channels.value[picked].user_login);
	nextTick( ()=>{
		let imgid = channels.value[picked].user_id;
		let showImg = document.getElementById(imgid);
		showImg.style['z-index'] = 2;
	});
}

function nextLoop() {
	let imgid = channels.value[showChannel.value].user_id;
	let showImg = document.getElementById(imgid);
	if (showChannel.value < channels.value.length) {
		showImg.style['z-index'] = 1;
	}
	showChannel.value++;
	if (showChannel.value < channels.value.length) {
		imgid = channels.value[showChannel.value].user_id;
		showImg = document.getElementById(imgid);
		showImg.style['z-index'] = 2;
		setTimeout( nextLoop, 200 );
	} else {
		randomize();
	}
}
	
function startLoop() {
	showChannel.value = 0;
	raidChanNum.value = null;
	nextTick( nextLoop );
}

async function raid() {
	const picked = raidChanNum.value;
	const userid = props.auth.profile.id;
	const uid = channels.value[picked].user_id;
	console.log("Raiding", picked, channels.value[picked].user_login, "...");
	try {
	const raidResult = await fetch(
		"https://api.twitch.tv/helix/raids?from_broadcaster_id=" + userid + "&to_broadcaster_id=" + uid, // uid
		{method: "POST",
		headers: {
    'Authorization': 'Bearer ' + props.auth.accessToken,
	'Client-Id': props.auth.clientId,}
	});
	console.log("POST result", raidResult);
	const raidJson = await raidResult.json();
	console.log("RAID response json:", raidJson);
	} catch(error) {
      // handle error
      console.log('ERROR raiding:',error);
      errMsg.value = 'ERROR raiding: ' + error.message;
	}
	
}

</script>

<template>
<div>
<div>Stream Picker: <span v-if="channels">{{showChannel}} / {{channels.length}}</span>
<div v-if="channels" style="position:relative">
	<div>
	<div v-for="channel in channels" style="position:absolute; z-index:1" class="channelThumbnail" :id="channel.user_id">
	<img  :src="channel.thumbnail_url.replace('{width}',300).replace('{height}',200)" 
	:alt="channel.user_login" width="300" height="200" 
	 
	/>
	</div>
	</div>
	<div id="channelpicker" style="top:200px; position:relative">
		<div style="position:relative"><button @click="startLoop">Randomize!</button></div>
		<div v-if="raidChanNum != null" style="position:relative">
			<button @click="raid">Raid {{channels[raidChanNum].user_login}}</button>
			<div>#{{raidChanNum}} <span>{{channels[raidChanNum].user_login}}</span> <span>{{channels[raidChanNum].viewer_count}} viewers, playing
				{{channels[raidChanNum].game_name}}</span>
			</div>
			<div>{{channels[raidChanNum].title}}</div>
			<div>tags: {{channels[raidChanNum].tags}}</div>
		</div>
	</div>
</div>

	
</div>
<div v-if="errMsg" style="color:red; font-weight:bold">ERROR: {{errMsg}}</div>
</div>
</template>