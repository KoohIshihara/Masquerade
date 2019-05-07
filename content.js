
const extensionId = 'ibneimfgholiicgfmdlegjpbgajblbmh';

var letAutoSearch;

//var letAutoSearch = true;

// onloadで毎回繰り返す
window.onload = async function(){

  console.log('extension works');
  console.log('host:', location.host);

  // getLetAutoSearchの状態をエクステンションから問い合わせる
  chrome.runtime.sendMessage(extensionId, {type: 'getLetAutoSearch'}, async function(res){
    console.log('onload response', res);
    letAutoSearch = res;

    if(letAutoSearch){
      runScraping();

      // エラーか何かで先に進まなくなった場合
      setTimeout(function(){
        console.log('restart...');
        scrapingCommandsInOthers.toSearchPage();
      }, 5000);
    }
  });
  

  //runScraping();

}


var submitSearchWord = async function(searchWord){

  // サーチフォームの取得
  var searchForm = document.getElementById('tsf');
  var inputs = searchForm.getElementsByTagName('input');

  var searchInput;
  for(var i=0; i<inputs.length; i++){
    if(inputs[i].type != 'hidden' && inputs[i].classList.contains('gsfi')) searchInput = inputs[i];
  }

  searchInput.value = searchWord;

  await sleep(random(1000, 1600));

  searchForm.submit();

}

var scrapingCommandsInSearchPage = {
  search: function(){
    console.log('search');
    // background.jsがgetした後にchrome.runtime.onMessageを発火させる
    chrome.runtime.sendMessage(extensionId, {type: 'getRandomWords'}, function(res){
      //console.log(res);
    });
  },
  onList: async function(){
    console.log('onList');

    // グーグルのトップページの場合リンクはない
    if(location.pathname == '/webhp') scrapingCommandsInSearchPage.search();

    var lists = document.getElementsByClassName('r');
    var targetList = lists[Math.floor(Math.random() * lists.length)];

    await sleep(random(1000, 1600));
    targetList.firstElementChild.click();
  },
};

var scrapingCommandsInOthers = {
  toSearchPage: async function(){
    console.log('toSearchPage');

    await sleep(random(1000, 1600));
    location.href = 'https://www.google.com/search';
  },
  onRandomLink: async function(){
    console.log('onRandomLink');

    await sleep(random(1000, 1600));
    var aTags = document.getElementsByTagName('a');
    var targetTag = aTags[Math.floor(Math.random() * aTags.length)];
    if(targetTag.target.indexOf('brank') == -1) targetTag.click();


    // クリツクしても飛ばなかった場合は他のコマンドを実行
    var commandsArray = Object.entries(scrapingCommandsInOthers).map(([key, value]) => (value));
    var command = commandsArray[Math.floor(Math.random() * commandsArray.length)];
    command();
  }
};

var runScraping = function(){

  if(location.host == 'www.google.com' && (location.pathname == '/search' || location.pathname == '/webhp')){
    
    var commandsArray = Object.entries(scrapingCommandsInSearchPage).map(([key, value]) => (value));
    var command = commandsArray[Math.floor(Math.random() * commandsArray.length)];
    command();

    // for test
    //var searchWord = String(random(0, 100));
    //if(letAutoSearch) submitSearchWord(searchWord);
  }else{
    var commandsArray = Object.entries(scrapingCommandsInOthers).map(([key, value]) => (value));
    var command = commandsArray[Math.floor(Math.random() * commandsArray.length)];
    command();
  }

}


// message passing
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log('receive message', request);
  switch(request.type){
    case 'autoSearchToggle':
      letAutoSearch = request.letAutoSearch;

      if(letAutoSearch){
        runScraping();
      }

      sendResponse('complete toggle');
    break;

    case 'submitWords':

      console.log('submitWords');
      var searchWord = request.words;
      if(searchWord.indexOf(':') != -1) searchWord = searchWord.split(':')[1];

      if(letAutoSearch) submitSearchWord(searchWord);

    break;
  }
  
});



// utils
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const random = function(min, max){
  return Math.random() * (max - min) + min;
}


