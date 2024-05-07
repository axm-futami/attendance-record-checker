document.getElementById('result').style.display = 'none';

document.getElementById('checkButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "check"}, function(response) {
      document.getElementById('result').style.display = 'block';

      var responseData = JSON.stringify(response.data);
      if (responseData === '問題ありません') {
        document.getElementById('result').textContent = responseData;
        return;
      }

      var responseArray = JSON.parse(responseData);
      var span = document.createElement('span');
      span.textContent = '以下の部分を確認してください';
      document.getElementById('result').appendChild(span);
      for (var key in responseArray) {
        var p = document.createElement('p');
        p.textContent = key + ' : ' + responseArray[key].message;
        document.getElementById('result').appendChild(p);
      }
    });
  });
});