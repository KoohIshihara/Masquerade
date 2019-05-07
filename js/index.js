
var letAutoSearch = false;

window.onload = function(){

  var startButton = document.getElementById('startButton');
  startButton.addEventListener('click', toggleStartStop);

  var stopButton = document.getElementById('stopButton');
  stopButton.addEventListener('click', toggleStartStop);

  // alert(letAutoSearch);

}

var toggleStartStop = function(){

  console.log('host', location.host);

  letAutoSearch = !letAutoSearch;

  var wrapButton = document.getElementById('wrapButton');
  wrapButton.classList.toggle('active');
  wrapButton.classList.toggle('un-active');

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {letAutoSearch: letAutoSearch, type: 'autoSearchToggle'}, function(response){
      console.log('response', response);
    });
  });

}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  
  switch(request.type){
    case 'getLetAutoSearch':
      sendResponse(letAutoSearch);
    break;
  }

})


