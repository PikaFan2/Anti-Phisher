fuse_list = ["sberbank.ru","tinkoff.ru","pochtabank.ru","vtb.ru","raiffeisen.ru","cbr.ru","rshb.ru","alfabank.ru","gazprombank.ru","sovcombank.ru","open.ru","rosbank.ru","mtsbank.ru","psbank.ru","bm.ru","otpbank.ru","bspb.ru","homecredit.ru","rencredit.ru","tochka.com","uralsib.ru","avangard.ru","rsb.ru","akbars.ru","citibank.ru","forabank.ru","skbbank.ru","unicreditbank.ru","crediteurope.ru","cetelem.ru","rusfinancebank.ru","minbank.ru","absolutbank.ru","mkb.ru","smpbank.ru","bankofkazan.ru","lockobank.ru","zapsibkombank.ru","rgsbank.ru","vtb24.ru","zenit.ru","expobank.ru","centrinvest.ru","sviaz-bank.ru","ubrr.ru","genbank.ru","binbank.ru","prostobank.online","capital-bank.ru","poidem.ru","modulbank.ru","bank-hlynov.ru","kk.bank","bcs-bank.com","pskb.com","banksoyuz.ru","rncb.ru","km-bank.ru","novikom.ru","atb.su","metallinvestbank.ru","nsbank.ru","mosoblbank.ru","koshelev-bank.ru","transcapital.ru","qiwi.com","primbank.ru","tavrich.ru","sdm.ru","rn-bank.ru","severgazbank.ru","vbrr.ru","gebank.ru","itb.ru","maritimebank.com","solid.ru","bbr.ru","lanta.ru","dvbank.ru","energotransbank.com","unistream.ru","wb-bank.ru","mspbank.ru","kuzbank.ru","finambank.ru","akibank.ru","sngb.ru","vtkbank.ru","toyota-bank.ru","akcept.ru","rosbank-dom.ru","ibv.ru","agroros.ru","bancaintesa.ru","domrfbank.ru","vfbank.ru","klookva.ru","baltinvestbank.com","baikalinvestbank.ru","finsb.ru","alexbank.ru","bmwbank.ru","coalmetbank.ru","avtogradbank.ru","creditural.ru","promtransbank.ru","round.ru","sksbank.ru","psbst.ru","albank.ru","forshtadt.ru","bankorange.ru","rusnarbank.ru","bgfbank.ru","timerbank.ru","ns-bank.ru","baltbank.ru","vlbb.ru","mcbankrus.ru","bankvl.ru"];
//fuse_list = [];
const fuse_options = {
  includeScore: true,
  minMatchCharLength: 2
};

var storage = chrome.storage.local; // Доступ к локальному хранилищу
var fishing = [];					// Массив фишинговых сайтов
var good_site = [];					// Массив сайтов финансовых организаций

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		console.log("Установлен");

		// Создаем экземпляр класса XMLHttpRequest
		const request = new XMLHttpRequest();

		// Указываем путь до файла на сервере, который будет обрабатывать наш запрос 
		const url = "http://arctic-buoy-school2072.ru/fishing/get_storage.php";
		 
		// Так же как и в GET составляем строку с данными, но уже без пути к файлу 
		const params = "";
		 
		/* Указываем что соединение	у нас будет POST, говорим что путь к файлу в переменной url, и что запрос у нас
		асинхронный, по умолчанию так и есть не стоит его указывать, еще есть 4-й параметр пароль авторизации, но этот
			параметр тоже необязателен.*/ 
		request.open("POST", url, true);
		 
		//В заголовке говорим что тип передаваемых данных закодирован. 
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.responseType = 'json';
		request.addEventListener("readystatechange", () => {

			if(request.readyState === 4 && request.status === 200) {    
				// Данные от сервера получили
				console.log(request.response);				
				storage.set({'fishing': JSON.stringify(request.response.fishing)}, function() {
					// Notify that we saved.
					console.log('Settings  fishing saved');
				});
				storage.set({'good_site': JSON.stringify(request.response.good_site)}, function() {
					// Notify that we saved.
					console.log('Settings good_site saved');
				});
		}
		});
		//	Вот здесь мы и передаем строку с данными, которую формировали выше. И собственно выполняем запрос. 
		request.send(params);
	}
});
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
		console.log(changeInfo);
		const url = new URL(changeInfo.url);
		if((changeInfo.url.indexOf("chrome:") == -1) && (changeInfo.url.indexOf("chrome-extension:") == -1) && (changeInfo.url.indexOf("newtab") == -1))  {
			storage.set({'currentURL': changeInfo.url}, function() { // созраняем текущий url для страницы параметров
						console.log("Записал "+changeInfo.url);
			});
			storage.get('fishing', function(items) {
				if (items.fishing) {
				  fishing = JSON.parse(items.fishing);
				}
				else console.log("Нет fishing");
			});
			storage.get('good_site', function(items) {
				if (items.good_site) {
					good_site = JSON.parse(items.good_site);
					console.log(good_site);				
					if(fuse_list.length == 0) {
	//					fuse_list = good_site;
					}
				}	
				else console.log("Нет good_site");
			});	
	//	Проверка на фишинг - здесь
	//	1-й этап: проверяем наличие Url в списке фишинговых сайтов
			for(i=0; i < fishing.length; i++) {
				if(fishing[i].site == changeInfo.url) { // страница находится в списке фишинговых сайтов - показываем уведомление
					storage.set({'fishinMSG': "Страница в списке фишинговых сайтов!"}, function() { // созраняем сообщение для popup окна 
	//							console.log(changeInfo.url);
					});
					Alert_message("Страница в списке фишинговых сайтов!");
					console.log("Страница в списке фишинговых сайтов!!!");
					break;
				}
			}
	// 2-й этап: проверяем "похожесть" URL со списком хороших сайтов с использованием библиотеки нечеткого поиска Fuse.js
			fuse_list = good_site;
	//		console.log(fuse_list);
			if(changeInfo.hostname == "") search_str = url.href;
			else search_str = url.hostname;
	//		search_str = "www.on.tinkoff_b.ru/";
			console.log("search "+String(url.hostname));	
			const fuse = new Fuse(fuse_list, fuse_options);		
			const result = fuse.search(String(url.hostname));
			console.log("result ");
			console.log(result);		
			if(result.length != 0) {
				if(result[0].score <= 0.5) {
					storage.set({'fishinMSG': "Фишинг сайта "+result[0].item+"<br/>с вероятностью "+Math.floor((1-result[0].score)*100)+"%!<br/>"}, function() { // созраняем сообщение для popup окна 
					});
					Alert_message("Фишинг сайта "+result[0].item+"!");
				}
			}
		}
    }
  }
);
function Alert_message(msg) {
	chrome.tabs.query({active:true,currentWindow:true},function(tabs){
		//Get the popup for the current tab
		chrome.browserAction.getPopup({tabId:tabs[0].id},function(popupFile){
			if(popupFile){
				openPopup(tabs[0],popupFile);
			} else {
				//There is no popup defined, so we do what is supposed to be done for
				//  the browserAction button.
				doActionButton(tabs[0]);
			}
		});
	});
}
// Открытие popup окна при сообщении об опасном сайте
//popupWindowId can be true, false, or the popup's window Id.
var popupWindowId = false;
var lastFocusedWin;
var lastActiveTab;
function openPopup(tab,popupFile){
    chrome.windows.getLastFocused(function(win){
        lastFocusedWin=win;
        if(popupWindowId === false){
            //This prevents user from pressing the button quickly multiple times in a row.
            popupWindowId = true;
            lastActiveTab = tab;
            chrome.windows.create({ 
                url: popupFile, 
                type: 'popup',
            },function(win){
                popupWindowId = win.id;
                waitForWindowId(popupWindowId,50,20,actOnPopupViewFound,do2ndWaitForWinId);
            });
            return;
        }else if(typeof popupWindowId === 'number'){
            closePopup();
        }
    });
}

function closePopup(){
    if(typeof popupWindowId === 'number'){
        chrome.windows.remove(popupWindowId,function(){
            popupWindowId = false;
        });
    }
}

chrome.windows.onRemoved.addListener(function(winId){
    if(popupWindowId === winId){
        popupWindowId = false;
    }
});

chrome.windows.onFocusChanged.addListener(function(winId){
    //If the focus is no longer the popup, then close the popup.
    if(typeof popupWindowId === 'number'){
        if(popupWindowId !== winId){
            closePopup();
        }
    } else if(popupWindowId){
    }
});

function actOnPopupViewFound(view){
    //Make tabs.query act as if the panel is a popup.
    if(typeof view.chrome === 'object'){
        view.chrome.tabs.query = fakeTabsQuery;
    }
    if(typeof view.browser === 'object'){
        view.browser.tabs.query = fakeTabsQuery;
    }
    view.document.addEventListener('DOMContentLoaded',function(ev){
        let boundRec = view.document.body.getBoundingClientRect();
        updatePopupWindow({
            width:boundRec.width + 10,
            height:boundRec.height + 10
        });
    });
    updatePopupWindow({});
}

function updatePopupWindow(opt){
    let width,height;
    if(opt){
        width =typeof opt.width  === 'number'?opt.width :300;
        height=typeof opt.height === 'number'?opt.height:300;
    }
    //By the time we get here it is too late to find the window for which we
    //  are trying to open the popup.
    let left = lastFocusedWin.left + lastFocusedWin.width - (width +40);
    let top = lastFocusedWin.top + 85; //Just a value that works in the default case.
    let updateInfo = {
        width:width,
        height:height,
        top:top,
        left:left
    };
    chrome.windows.update(popupWindowId,updateInfo);
}

function waitForWindowId(id,delay,maxTries,foundCallback,notFoundCallback) {
    if(maxTries--<=0){
        if(typeof notFoundCallback === 'function'){
            notFoundCallback(id,foundCallback);
        }
        return;
    }
    let views = chrome.extension.getViews({windowId:id});
    if(views.length > 0){
        if(typeof foundCallback === 'function'){
            foundCallback(views[0]);
        }
    } else {
        setTimeout(waitForWindowId,delay,id,delay,maxTries,foundCallback,notFoundCallback);
    }
}

function do2ndWaitForWinId(winId,foundCallback){
    //Poll for the view of the window ID. Poll every 500ms for a
    //  maximum of 40 times (20 seconds). 
    waitForWindowId(winId,500,40,foundCallback,windowViewNotFound);
}

function windowViewNotFound(winId,foundCallback){
    //Did not find the view for the window. Do what you want here.
    //  Currently fail quietly.
}

function fakeTabsQuery(options,callback){
    //This fakes the response of chrome.tabs.query and browser.tabs.query, which in
    //  a browser action popup returns the tab that is active in the window which
    //  was the current window when the popup was opened. We need to emulate this
    //  in the popup as panel.
    //The popup is also stripped from responses if the response contains multiple
    //  tabs.
    let origCallback = callback;
    function stripPopupWinFromResponse(tabs){
        return tabs.filter(tab=>{
            return tab.windowId !== popupWindowId;
        });
    }
    function stripPopupWinFromResponseIfMultiple(tabs){
        if(tabs.length>1){
            return stripPopupWinFromResponse(tabs);
        }else{
            return tabs;
        }
    }
    function callbackWithStrippedTabs(tabs){
        origCallback(stripPopupWinFromResponseIfMultiple(tabs));
    }
    if(options.currentWindow || options.lastFocusedWindow){
        //Make the query use the window which was active prior to the panel being
        //  opened.
        delete options.currentWindow;
        delete options.lastFocusedWindow;
        options.windowId = lastActiveTab.windowId;
    }
    if(typeof callback === 'function') {
        callback = callbackWithStrippedTabs;
        chrome.tabs.query.apply(this,arguments);
        return;
    }else{
        return browser.tabs.query.apply(this,arguments)
                                 .then(stripPopupWinFromResponseIfMultiple);
    }
}