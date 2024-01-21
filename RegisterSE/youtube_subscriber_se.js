const OBSWebSocket = require('obs-websocket-js').default;
const client = require("request");
const obs = new OBSWebSocket();
const decreaseSe = "登録者減少"
const increaseSe = "登録者増加"
const obsHost = "192.168.10.101"
const obsPort = "4455"
const obsPassword = "9xq9iEFiDYcVIRSx"
const googleApiKey = "AIzaSyBdE8WIwvVcbbLby2XVW-tm41AOt169PB8"
const channelId = "UCpZd2ct72njFCZonzRW94iw"
let prevSubscriberCount = 0

obs.connect(url = 'ws://' + obsHost + ':' + obsPort, password = obsPassword)

async function restartDecreaseSe(obs) {
    return await obs.call('TriggerMediaInputAction', {"inputName": decreaseSe, "mediaAction": "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART"})
}
async function restartIncreaseSe(obs) {
    return await obs.call('TriggerMediaInputAction', {"inputName": increaseSe, "mediaAction": "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART"})
}
function callyoutubeDataApi(obs) {
    client.get({
        url: "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + channelId + "&key=" + googleApiKey,
      }, function (error, response, body){
        const data = JSON.parse(body);
        const currentSubscriberCount = data["items"][0]["statistics"]["subscriberCount"];
        if (prevSubscriberCount < 1) {
            prevSubscriberCount = currentSubscriberCount;
        }
        console.log("============= prevSubscriberCount ================")
        console.log(prevSubscriberCount)
        console.log("============= currentSubscriberCount ================")
        console.log(currentSubscriberCount);
        if (prevSubscriberCount > currentSubscriberCount) {
            // 登録者減少させる関数はこちら
            console.log("============= "+decreaseSe+" ================")
            //restartDecreaseSe(obs)
        } else if (currentSubscriberCount > prevSubscriberCount) {
            // 登録者増加したときはこちら
            restartIncreaseSe(obs)
        }
        prevSubscriberCount = currentSubscriberCount;
      });
}

setTimeout(() => {
    setInterval(() => {
        callyoutubeDataApi(obs)
    }, 3000);
}, 2000);
