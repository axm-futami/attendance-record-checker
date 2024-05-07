chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "check") {
    var message = {};
    var element = document.getElementById('inputTable');
    Array.from(element.querySelectorAll('.js-cm-scrTbl__innerTr'), item => {
      var itemArray = item.innerText.split('\t');
      itemArray = itemArray.map(function(item){
        return item.replace(/\n/g, '');
      });
      // itemArrayの内容例
      // ['1', '', ' 4/ 5 (金)', '107 在宅/9:30-18:30', '027 残業', '9:25', '21:25', '1:00', '', '', '10:55', '', '2:55', '', '', '障害調査のため残業いたしました。（残業18:30-21:25 休憩なし）']

      // 自社出勤の場合、備考に理由の記載があるか確認
      if(itemArray[3].includes('自社')){
        message[itemArray[2]] = {message: 'a'};
        if(itemArray[16] === ''){
          message[itemArray[2]] = {message: '自社出勤の備考が空です'};
          console.log('自社出勤の備考が空です');
        }
      }

      // 勤務時間が設定されていて、退勤時間が設定の時間から1時間以上離れている時、申請もしくは備考に理由の記載があるか確認
      if(!itemArray[3].includes('基本勤務')){
        var endTime = itemArray[3].split('-')[1];
        var actualEndTime = itemArray[6];
        // 退勤時間と実際の退勤時間の差を取得
        var diff = Math.abs(new Date('1970/01/01 ' + endTime) - new Date('1970/01/01 ' + actualEndTime)) / 36e5;
        // 差が1時間以上の時、申請もしくは備考に理由の記載があるか確認
        if(diff >= 1){
          message[itemArray[2]] = {message: 'b'};

          if(itemArray[0] === '' && itemArray[16] === ''){
            message[itemArray[2]] = {message: '自社出勤の備考が空です'};
            console.log('退勤時間が設定の時間から1時間以上離れているため、残業申請や事由について確認してください');
          }
        }
      }

      // 早出・夜勤の時、備考に理由の記載があるか確認
      if(itemArray[3].includes('早出・夜勤')){
        message[itemArray[2]] = {message: 'c'};
        if(itemArray[16] === ''){
          message[itemArray[2]] = {message: '自社出勤の備考が空です'};
          console.log('早出・夜勤の備考が空です');
        }
      }

      // 残業の時、備考に残業と休憩時間の記載があるか確認
      if(itemArray[4].includes('残業')){
        message[itemArray[2]] = {message: 'd'};
        if(itemArray.includes('残業')&&itemArray.includes('休憩')){
          message[itemArray[2]] = {message: '自社出勤の備考が空です'};
          console.log('残業の備考が空です');
        }
      }

      // 遅刻の時、申請もしくは備考に理由の記載があるか確認
      if(itemArray[1].includes('遅')){
        message[itemArray[2]] = {message: 'e'};
        if(itemArray[0] === '' && itemArray[16] === ''){
        message[itemArray[2]] = {message: '自社出勤の備考が空です'};

          console.log('遅刻していますが、申請が出ていない、もしくは備考に記載がありません');
        }
      }

      // 早退の時、申請もしくは備考に理由の記載があるか確認
      if(itemArray[1].includes('早')){
        message[itemArray[2]] = {message: 'f'};
        if(itemArray[0] === '' && itemArray[16] === ''){
        message[itemArray[2]] = {message: '自社出勤の備考が空です'};

          console.log('早退していますが、申請が出ていない、もしくは備考に記載がありません');
        }
      }

      // バースデー休暇の時、備考に誕生日の記載があるか確認
      if(itemArray[4].includes('バースデー')){
        message[itemArray[2]] = {message: 'g'};
        if(itemArray[16].includes('/')
          ||(itemArray[16].includes('月') && itemArray[16].includes('日'))){
            message[itemArray[2]] = {message: '自社出勤の備考が空です'};
          console.log('バースデー休暇の備考に誕生日が記載されているか確認してください');
        }
      }
    });

    if(Object.keys(message).length === 0){
      message = '問題ありません';
    }
    console.log(message);
    sendResponse({"data": message});
  }
});
