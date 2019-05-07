
const extensionId = 'ibneimfgholiicgfmdlegjpbgajblbmh';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type == "getRandomWords") {
    
    chrome.tabs.query({active: true}, async function(tabs) {

      var content = await getJsonViaAjax('https://ja.wikipedia.org/w/api.php?format=json&action=query&list=random&rvprop=content');

      var message = {
        type: 'submitWords',
        words: content.query.random[0].title,
      };

      console.log('[background.js] message', message);

      chrome.tabs.sendMessage(tabs[0].id, message, function(response){
        console.log('response', response);
      });

    });

    //sendResponse('comp getRandomWords');

    return true;

  }
});


var getJsonViaAjax = function(url/*, json*/) {
  return new Promise(resolve => {

    $.ajax({
      type : 'post',
      url : url,
      //data : JSON.stringify(json),
      //contentType: 'application/JSON',
      //dataType : 'JSON',
      scriptCharset: 'utf-8',
      success : function(data) {
        return resolve(data);
      },
      error : function(data) {
        console.log('error', data);
      }
    });

  });
}

