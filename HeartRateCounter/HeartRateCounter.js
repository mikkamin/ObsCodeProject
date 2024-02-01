//--------------------------------------------------------------
// 変更必須
//--------------------------------------------------------------
// pulsoid　で　各自tokenを発行し　下記を上書きする。
const accessToken = "a44482db-c6e1-4b50-946a-d58c49f43c99"

//--------------------------------------------------------------
// 変更が必要があれば
//--------------------------------------------------------------
// 関数を実行するまでの待機時間 [ms]
const timeoutDelay = 1000;
//--------------------------------------------------------------

const pulsoidURL = 'https://dev.pulsoid.net/api/v1/data/heart_rate/latest?access_token=' + accessToken + '&response_mode=text_plain_only_heart_rate';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xml = new XMLHttpRequest();

const heartRate = 0;
const prevHeartRate = 0;

// Http通信で心拍数を更新
function UpdateHeartRateWithHttp() {
    xml.open("GET", pulsoidURL);
    xml.send();

    xml.onreadystatechange = (e) => {
        // 通信に成功
        if (xml.status == 200) {
            prevHeartRate = heartRate;
            heartRate = Number(xml.responseText);

            console.log("----- " + prevHeartRate + " -> " + heartRate + " -----");
        }
        // 通信に失敗、通信中
        else {
        }
    }
}

setTimeout(() => {
    UpdateHeartRateWithHttp();
}, timeoutDelay);

// 最新の心拍数を返す
function GetHeartRate() {
    return heartRate;
}

// ひとつ前の心拍数を返す
function GetPrevHeartRate() {
    return prevHeartRate;
}

// 前回の心拍数と比較し変化を返す
// 0 変化なし
// - 下がった
// + 上がった
function GetStateHeartRate() {
    return heartRate - prevHeartRate;
}