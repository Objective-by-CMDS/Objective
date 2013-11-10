(window.myBookmarklet = function() {
	var id = '527fa94f8a8e2ada72000012';
	var name = prompt("Enter name for task:");
	var notes = prompt("Enter notes for task:");
	var url = location.href.replace(/https?:\/\//i, "");
	ifrm = document.createElement('IFRAME');
	ifrm.style.width = '0px';
	ifrm.style.height = '0px';
	ifrm.src = "http://moin.2013.nodeknockout.com/add/task/?id="+ id + "&name=" + name + "&notes=" + notes + "&url=" + url;
	document.body.appendChild(ifrm);	
})();