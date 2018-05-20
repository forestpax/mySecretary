const request = require('request');

function delayCheck() {
  request.get({
    url: 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json',
    json: true
  }, function (error, response, body) {
    for (let i = 0; i < body.length; i++) {
      if (body[i].name.indexOf('東海道本線') >= 0) {
        console.log( body[i] +'が遅延しています');

      }
    }
  })

}