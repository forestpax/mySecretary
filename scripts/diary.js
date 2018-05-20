'use strict';
const request = require('request');
const moment = require('moment-timezone');
const Diary = require('../database/save');
const Memo = require('../database/memo');
const URL = process.env.URL;


module.exports = (robot) => {
  robot.respond(/howtouse/i, (msg) => {
    const templete = "・respond 'diary'\n記録をつける\n・respond 'done'\n記録の閉鎖・\nhear 'memo_reg'\nメモの登録\nhear 'memo_list'\nメモリストの表示\n・hear 'memo_del'\nメモの削除"
    msg.send(templete);
  });

  let timestamp, content, relation;

  robot.respond(/diary/i, (msg) => {
    msg.send('content: をつけて内容を投稿してください');
  });

  robot.hear(/content: (.+)/i, (msg) => {
    content = msg.match[1].trim();
    msg.send('relation: をつけて関連付けを投稿してください');

    request.get({
      url: URL,
      qs: { process: "relationList" },
      json: true
    }, function (error, response, body) {
      let ary = body.relations;
      ary.forEach(rel => {
        msg.send(rel);
      });
    })


  });

  robot.hear(/relation: (.+)/i, (msg) => {
    timestamp = moment().tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm:ss');

    relation = msg.match[1].trim();
    let options = {
      uri: URL,
      headers: {
        "Content-type": "application/json",
      },
      json: {
        "timestamp": timestamp,
        "content": content,
        "relation": relation
      }
    };
    msg.send('記録しました。\n timestamp: ' + timestamp + '\n content: ' + content + '\n relation: ' + relation);
    request.post(options, function (error, response, body) {
      if (error) {
        //console.log(error);
      } else {
        //console.log(response);
        Diary.create({
          content: content,
          caseName: relation,
          status: false
        }).then(() => {
          return;
        });
      }

    });
  });


  robot.respond(/done/i, (msg) => {
    request.get({
      url: URL,
      qs: { process: "relationList" },
      json: true
    }, function (error, response, body) {
      let ary = body.relations;
      ary.forEach(rel => {
        msg.send(rel);
      });
    });
    msg.send('完了にする関連付けを done: をつけて投稿してください');
    robot.hear(/done: (.+)/i, (msg) => {
      var caseName = msg.match[1].trim();
      //console.log(caseName);

      request.get({
        url: URL,
        qs: { process: "done", caseName: caseName },
        json: true
      }, function (error, response, body) {
        if (error) {
        } else {
        }
      });
      msg.send(caseName + 'を閉鎖しました')
      Diary.update({
        status: true
      }, {
          where: {
            caseName: caseName
          }
        }).then(() => {

        });
    });

  });

  robot.respond(/schedule/i, (msg) => {
    request.get({
      url: URL,
      qs: { process: "schedule" },
      json: true
    }, function (error, response, body) {
      let schedule = body.schedule;
      msg.send(schedule);
      //      ary.forEach(sch => {
      //      msg.send(sch);
      //  });
    });
  });

  let memo, memoTitle, memoContent;
  robot.hear(/memo_reg/i, (msg) => {
    memo = msg.message.text;
    memoTitle = memo.match(/title: (.+)/i)[1];
    memoContent = memo.match(/memo: (.+)/i)[1];
    // console.log(memoTitle);

    Memo.create({
      memoTitle: memoTitle,
      memoContent: memoContent
    }).then(() => {
      msg.send('メモを登録しました。');
    })
  })

  //memoTitle のリストを表示
  let memoList;
  robot.hear(/memo_list/i, (msg) => {
    memoList = ''
    Memo.findAll().then((result) => {
      result.forEach(r => {
        memoList += '[' + r.id + '] ' + r.memoTitle + '\n';
      })
    }).then(() => {
      msg.send('メモタイトルの一覧です。\n' + memoList + '"memo_view " + id で閲覧できます。');
    });
  })

  //memo を見る
  robot.hear(/memo_view (.+)/i, (msg) => {
    let memoId = msg.match[1];
    Memo.findAll({
      where: {
        id: memoId
      }
    }).then((result) => {
      result.forEach(r => {
        msg.send(r.memoContent);
      })
    })
  })

  //memo の削除
  robot.hear(/memo_del (.+)/i, (msg) => {
    let memoNumber = msg.match[1];
    Memo.destroy({
      where: {
        id: memoNumber
      }
    }).then(() => {
      msg.send('メモを削除しました。')
    })
  })
}

