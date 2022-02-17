
window.addEvent("domready", function() {
	storage.get('currentURL', function(items) { 
		if (items.currentURL) {
			$("currentURL").value = items.currentURL;
		}
		else {
			console.log("РќРµС‚ currentURl");
			$("#currentURL").value = "";
		}
	});
// Привязываем отправку информации о фишинговой странице к кнопке
	$("sendFishing").addEvent("click", function(event) {
		event.stop();
		sendSite(event);
	});
	var list_list = $("list_list").empty();
	list_table = new Element("table", {});
	tr = new Element("tr", {"class":"even"});	
	header_td = new Element("td", {"html":'<h4 align="center"><a href="javascript:void();">' + "№" + "</a></h4>"});	
	tr = tr.grab(header_td);
	header_td = new Element("td", {"html":'<h4 align="center"><a href="javascript:void();">' + "URL сайта" + "</a></h4>"});
	tr = tr.grab(header_td);
	header_td = new Element("td", {"html":'<h4 align="center"><a href="javascript:void();">' + "Описание" + "</a></h4>"});
	tr = tr.grab(header_td);
	header_td = new Element("td", {"html":'<h4 align="center"><a href="javascript:void();">' + "Id автора" + "</a></h4>"});
	tr = tr.grab(header_td);	
	header_td = new Element("td", {"html":'<h4 align="center"><a href="javascript:void();">' + "" + "</a></h4>"});
	tr = tr.grab(header_td);	
	list_table.grab(tr);	
	for(i=0; i < fishing.length; i++) {
		if (i % 2) {className = "even"; } else {className = "odd";}
		tr = new Element("tr", {"class":className});		
		col = new Element("td", {text:i+1});
		tr = tr.grab(col);		
		td_site = new Element("td", {"id":"list" + (0), "html":'<h4><span class="folder">&nbsp;</span><a href="javascript:void();">' + fishing[i].site + "</a></h4>"});
		tr = tr.grab(td_site);
		td_descr = new Element("td", {"id":"list" + (0), "html":'<h4><a href="javascript:void();">' + fishing[i].descr + "</a></h4>"});
		tr = tr.grab(td_descr);	
		td_id = new Element("td", {"id":"list" + (0), "html":'<h4><a href="javascript:void();">' + fishing[i].id + "</a></h4>"});
		tr = tr.grab(td_id);	
        acts = new Element("td", {"class":"text-center"});
        acts.grab(new Element("a", {"href":"#", "title": "Нажмите, чтобы удалить строку", "class":"trbut", "rel":i, events:{"click":SiteDel}}));
        tr.grab(acts);		
		list_table.grab(tr);	  
	}
	list_list.grab(list_table);
})

function SiteDel(event) {
	promptMsg("Вы хотите удалить фишинговый сайт из списка?", "Подтвердите");
}
function sendSite(event) {
	promptMsg("Вы хотите отправить информацию о фишинговой странице на сервер?", "Подтвердите");
}
function okMsg(txt, end) {
  var SM = new SimpleModal({"btn_ok":l("Закрыть"), "onClose":end});
  SM.show({"title":"Отправка фишинговой страницы", "contents":txt});
}
function promptMsg(txt, end) {
  var SM = new SimpleModal({"btn_ok":"Да", "btn_cancel":"Отменить"});
  SM.show({"model":"confirm","title":end, "contents":txt, "callback":function() {
	  console.log("aaa");
/*
		const request = new XMLHttpRequest();
		const url = "http://arctic-buoy-school2072.ru/fishing/send_info.php";
		const params = "id=123123";
		request.open("POST", url, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.responseType = 'json';
		request.addEventListener("readystatechange", () => {
			if(request.readyState === 4 && request.status === 200) {    
				// Данные от сервера получили
				console.log(request.response);				
		}
		});
		//	Вот здесь мы и передаем строку с данными, которую формировали выше. И собственно выполняем запрос. 
		request.send(params);
*/
    $.ajax({ 
       url: "ajax_quest.php", 
    // dataType: "json", // Для использования JSON формата получаемых данных
       	method: "GET", // Что бы воспользоваться POST методом, меняем данную строку на POST   
    	data: {"id_product": id_product,"qty_product": qty_product},
       	success: function(data) {
			
 		console.log(data); // Возвращаемые данные выводим в консоль
       } 
 });
  }});
}