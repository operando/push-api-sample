var subscriptionId = null;

window.addEventListener('load', function() {
  document.getElementById('register').addEventListener('click', register, false);
  document.getElementById('push').addEventListener('click', setPush , false);
  document.getElementById('execut_push').addEventListener('click', function(e) {
      var headers = new Headers();
      var key = document.getElementById('key').text;

      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', key);

      fetch('https://android.googleapis.com/gcm/send', {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
            registration_id: subscriptionId
        }),
        mode: 'no-cors'
      }).then(function(response) {
        return response.json();
      })
      .then((responseObj) => {
          console.log(responseObj);
        if (!responseObj.success) {
          throw new Error('Unsuccessful attempt to send push message');
        }
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    });
  navigator.serviceWorker.ready.then(checkPush);
}, false);

function register() {
  navigator.serviceWorker.register('./push.js').then(checkNotification);
}

function checkNotification() {
  Notification.requestPermission(function(permission) {
    if(permission !== 'denied')
      document.getElementById('push').disabled = false;
    else
      alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
  });
}

var subscription = null;

function checkPush(sw) {
  sw.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s) {
  if(!s)
    resetSubscription();
  else {
    document.getElementById('register').disabled = true;
    subscription = s;
    var p = document.getElementById('push');
    p.textContent = 'プッシュ通知を解除する';
    p.disabled = false;
    registerNotification(s);
  }
}

function resetSubscription() {
  document.getElementById('register').disabled = true;
  subscription = null;
  var p = document.getElementById('push');
  p.textContent = 'プッシュ通知を有効にする';
  p.disabled = false;
}

function setPush() {
  if(!subscription) {
    if(Notification.permission == 'denied') {
      alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
      return;
    }

    navigator.serviceWorker.ready.then(subscribe);
  }

  else
    navigator.serviceWorker.ready.then(unsubscribe);
}

function subscribe(sw) {
  sw.pushManager.subscribe({
    userVisibleOnly: true
  }).then(setSubscription, resetSubscription);
}

function unsubscribe() {
  if(subscription) {
    // 自分のWebアプリサーバ等にプッシュ通知の解除を通知する処理をここに実装
    subscription.unsubscribe();
  }
  resetSubscription();
}

function registerNotification(s) {
  var endpoint = s.endpoint;
  // Chrome 43以前への対処
  if(('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId))
    endpoint += '/' + s.subscriptionId;
    console.log(endpoint);
    subscriptionId = s.subscriptionId;
    document.getElementById('id').innerHTML = endpoint;
  // 自分のWebアプリサーバ等にプッシュ通知を登録する処理をここに実装
  // endpointにプッシュサービスのエンドポイントのURLが格納される
}
