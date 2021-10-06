const Peer = window.Peer;
var str = document.cookie;

function getCookieArray(){
    var arr = new Array();
    if(document.cookie != ''){
        var tmp = document.cookie.split('; ');
        for(var i=0;i<tmp.length;i++){
            var data = tmp[i].split('=');
            arr[data[0]] = decodeURIComponent(data[1]);
        }
    }
    return arr;
}

// keyを指定して取得
// 「 key1=val1; key2=val2; key3=val3; ・・・ 」というCookie情報が保存されているとする
var arr = getCookieArray();
var value = 'key1の値：' + arr['key1'];
// key1の値：val1
console.log(value);

var kigen = 30; //Cookieの期限（1ヶ月とする）←適宜、適切な期限を設定
var nowdate = new Date(); //現在の日付データを取得
nowdate.setTime(nowdate.getTime() + kigen*24*60*60*1000); //1ヶ月後の日付データを作成
var kigendate = nowdate.toGMTString(); //GMT形式に変換して変数kigendateに格納
var cookievalue = "session_id=user_0001; ";
var expires = "expires=" + kigendate + "; ";
var path = "path=/";
var dt = new Date('1999-12-31T23:59:59Z'); // 過去の日付をGMT形式に変換

document.cookie = cookievalue + expires + path;



(async function main() {
  const localId = document.getElementById('js-local-id');
  const localText = document.getElementById('js-local-text');
  const connectTrigger = document.getElementById('js-connect-trigger');
  const closeTrigger = document.getElementById('js-close-trigger');
  const sendTrigger = document.getElementById('js-send-trigger');
  const remoteId = document.getElementById('js-remote-id');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');

  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();

  const peer = (window.peer = new Peer({
    key:'5a1f4049-77cb-4da2-8a06-06a08d9f14fa',
    debug: 3,
  }));

  // Register connecter handler
  connectTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    const dataConnection = peer.connect(remoteId.value);

    dataConnection.once('open', async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;

      sendTrigger.addEventListener('click', onClickSend);
    });

    dataConnection.on('data', data => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once('close', () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger.removeEventListener('click', onClickSend);
    });

    // Register closing handler
    closeTrigger.addEventListener('click', () => dataConnection.close(true), {
      once: true,
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = '';
    }
  });

  peer.once('open', id => (localId.textContent = id));

  // Register connected peer handler
  peer.on('connection', dataConnection => {
    dataConnection.once('open', async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;

      sendTrigger.addEventListener('click', onClickSend);
    });

    dataConnection.on('data', data => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once('close', () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger.removeEventListener('click', onClickSend);
    });

    // Register closing handler
    closeTrigger.addEventListener('click', () => dataConnection.close(true), {
      once: true,
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = '';
    }
  });

  peer.on('error', console.error);
})();