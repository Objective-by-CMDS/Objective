javascript:(function () {
  window.scrollTo(0, 0);
  window.onscroll = function () { window.scrollTo(0, 0); };
  var body = document.body
      , id = "<%=_id%>"
      , elementBack = document.createElement('div')
      , cssSnip = "cursor: pointer; position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.5); content: ''; z-index: 2147483646;"
      , elementFront = document.createElement('div')
      , cssSnipFront = "text-align: left; position: absolute; width: 40%; height: 80%; box-sizing: border-box; -webkit-box-sizing: border-box; padding: 3% 5%; margin: 0 auto; background: #fff; z-index: 2147483647; top: 0; left: 30%;";
  elementBack.setAttribute('style', cssSnip);
  elementBack.setAttribute('id', "elementBack");
  document.body.appendChild(elementBack);
  console.log("Hi from the Bookmarklet");
  elementFront.setAttribute('style', cssSnipFront);
  elementFront.setAttribute('id', "elementFront");
  elementFront.style.top = "10%";
  elementFront.innerHTML = "
    <style>
      .labelStuff {
        font: 600 1em Helvetica, Arial, sans-serif;
        float: none;
        display: block;
      }
      .inputStuff {
        font: 400 1em Helvetica, Arial, sans-serif;
        margin: 2% 0; padding: 2.5% 3%;
        float: none;
        display: block;
        width: 100%;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -o-box-sizing: border-box;
        outline: none;
      }
      .inputStuff:focus {
        border: 1px solid #212121;
      }
      #submitStuff {
        background: #16ab56;
        border: none;
        box-shadow: 0 1px 0 #13652d;
        padding: 3%;
        margin: 3% 0 0;
        font: 600 1em Helvetica, Arial, sans-serif;
        color: white;
        cursor: pointer;
        float: none;
        display: block;
        width: auto;
        -webkit-transition: background 0.3s;
        -moz-transition: background 0.3s;
        -o-transition: background 0.3s;
        transition: background 0.3s;
      }
      #submitStuff:hover {
        background: #6ee79b;
      }
      #dropTitle {
        text-align: center;
        font: 2em Helvetica, Arial, sans-serif;
        color: #16AB56;
      }
    </style>
    <h1 id='dropTitle'>Add Objective Task</h1>
    <form>
      <input type='hidden'
      <label class='labelStuff' for='title'>Title</label> <br>
      <input class='inputStuff' name='title' type='text' placeholder='Title'><br>
      <label class='labelStuff' for='notes'>Notes</label> <br>
      <textarea class='inputStuff' name='notes' placeholder='Notes'></textarea><br>
      <label class='labelStuff' for='URL'>URL</label> <br>
      <input class='inputStuff' name='URL' type='text' placeholder='URL' value='" + window.location.href +  "'> <br>
      <input id='submitStuff' type='submit'>
    </form>";
  document.body.appendChild(elementFront);
  document.getElementById('elementBack').onclick=function(){
    document.body.removeChild(document.getElementById('elementFront'));
    document.body.removeChild(document.getElementById('elementBack'));
    window.onscroll = function () {};
  };
})();

// javascript:javascript:void((function%20()%20{%20window.scrollTo(0,%200);%20window.onscroll%20=%20function%20()%20{%20window.scrollTo(0,%200);%20};%20var%20body%20=%20document.body%20,%20id%20=%20%22<%=_id%>%22%20,%20elementBack%20=%20document.createElement(%27div%27)%20,%20cssSnip%20=%20%22cursor:%20pointer;%20position:%20absolute;%20top:%200;%20bottom:%200;%20left:%200;%20right:%200;%20background:%20rgba(0,%200,%200,%200.5);%20content:%20%27%27;%20z-index:%202147483646;%22%20,%20elementFront%20=%20document.createElement(%27div%27)%20,%20cssSnipFront%20=%20%22text-align:%20left;%20position:%20absolute;%20width:%2040%;%20height:%2080%;%20box-sizing:%20border-box;%20-webkit-box-sizing:%20border-box;%20padding:%203%%205%;%20margin:%200%20auto;%20background:%20#fff;%20z-index:%202147483647;%20top:%200;%20left:%2030%;%22;%20elementBack.setAttribute(%27style%27,%20cssSnip);%20elementBack.setAttribute(%27id%27,%20%22elementBack%22);%20document.body.appendChild(elementBack);%20console.log(%22Hi%20from%20the%20Bookmarklet%22);%20elementFront.setAttribute(%27style%27,%20cssSnipFront);%20elementFront.setAttribute(%27id%27,%20%22elementFront%22);%20elementFront.style.top%20=%20%2210%%22;%20elementFront.innerHTML%20=%20%22%20<style>%20.labelStuff%20{%20font:%20600%201em%20Helvetica,%20Arial,%20sans-serif;%20float:%20none;%20display:%20block;%20}%20.inputStuff%20{%20font:%20400%201em%20Helvetica,%20Arial,%20sans-serif;%20margin:%202%%200;%20padding:%202.5%%203%;%20float:%20none;%20display:%20block;%20width:%20100%;%20box-sizing:%20border-box;%20-webkit-box-sizing:%20border-box;%20-moz-box-sizing:%20border-box;%20-o-box-sizing:%20border-box;%20outline:%20none;%20}%20.inputStuff:focus%20{%20border:%201px%20solid%20#212121;%20}%20#submitStuff%20{%20background:%20#16ab56;%20border:%20none;%20box-shadow:%200%201px%200%20#13652d;%20padding:%203%;%20margin:%203%%200%200;%20font:%20600%201em%20Helvetica,%20Arial,%20sans-serif;%20color:%20white;%20cursor:%20pointer;%20float:%20none;%20display:%20block;%20width:%20auto;%20-webkit-transition:%20background%200.3s;%20-moz-transition:%20background%200.3s;%20-o-transition:%20background%200.3s;%20transition:%20background%200.3s;%20}%20#submitStuff:hover%20{%20background:%20#6ee79b;%20}%20#dropTitle%20{%20text-align:%20center;%20font:%202em%20Helvetica,%20Arial,%20sans-serif;%20color:%20#16AB56;%20}%20</style>%20<h1%20id=%27dropTitle%27>Add%20Objective%20Task</h1>%20<form>%20<input%20type=%27hidden%27%20<label%20class=%27labelStuff%27%20for=%27title%27>Title</label>%20<br>%20<input%20class=%27inputStuff%27%20name=%27title%27%20type=%27text%27%20placeholder=%27Title%27><br>%20<label%20class=%27labelStuff%27%20for=%27notes%27>Notes</label>%20<br>%20<textarea%20class=%27inputStuff%27%20name=%27notes%27%20placeholder=%27Notes%27></textarea><br>%20<label%20class=%27labelStuff%27%20for=%27URL%27>URL</label>%20<br>%20<input%20class=%27inputStuff%27%20name=%27URL%27%20type=%27text%27%20placeholder=%27URL%27%20value=%27%22%20+%20window.location.href%20+%20%22%27>%20<br>%20<input%20id=%27submitStuff%27%20type=%27submit%27>%20</form>%22;%20document.body.appendChild(elementFront);%20document.getElementById(%27elementBack%27).onclick=function(){%20document.body.removeChild(document.getElementById(%27elementFront%27));%20document.body.removeChild(document.getElementById(%27elementBack%27));%20window.onscroll%20=%20function%20()%20{};%20};%20})());
javascript:void((function () { window.scrollTo(0, 0); window.onscroll = function () { window.scrollTo(0, 0); }; var body = document.body , id = "<%=_id%>" , elementBack = document.createElement('div') , cssSnip = "cursor: pointer; position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.5); content: ''; z-index: 2147483646;" , elementFront = document.createElement('div') , cssSnipFront = "text-align: left; position: absolute; width: 40%; height: 80%; box-sizing: border-box; -webkit-box-sizing: border-box; padding: 3% 5%; margin: 0 auto; background: #fff; z-index: 2147483647; top: 0; left: 30%;"; elementBack.setAttribute('style', cssSnip); elementBack.setAttribute('id', "elementBack"); document.body.appendChild(elementBack); console.log("Hi from the Bookmarklet"); elementFront.setAttribute('style', cssSnipFront); elementFront.setAttribute('id', "elementFront"); elementFront.style.top = "10%"; elementFront.innerHTML = " <style> .labelStuff { font: 600 1em Helvetica, Arial, sans-serif; float: none; display: block; } .inputStuff { font: 400 1em Helvetica, Arial, sans-serif; margin: 2% 0; padding: 2.5% 3%; float: none; display: block; width: 100%; box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -o-box-sizing: border-box; outline: none; } .inputStuff:focus { border: 1px solid #212121; } #submitStuff { background: #16ab56; border: none; box-shadow: 0 1px 0 #13652d; padding: 3%; margin: 3% 0 0; font: 600 1em Helvetica, Arial, sans-serif; color: white; cursor: pointer; float: none; display: block; width: auto; -webkit-transition: background 0.3s; -moz-transition: background 0.3s; -o-transition: background 0.3s; transition: background 0.3s; } #submitStuff:hover { background: #6ee79b; } #dropTitle { text-align: center; font: 2em Helvetica, Arial, sans-serif; color: #16AB56; } </style> <h1 id='dropTitle'>Add Objective Task</h1> <form> <input type='hidden' <label class='labelStuff' for='title'>Title</label> <br> <input class='inputStuff' name='title' type='text' placeholder='Title'><br> <label class='labelStuff' for='notes'>Notes</label> <br> <textarea class='inputStuff' name='notes' placeholder='Notes'></textarea><br> <label class='labelStuff' for='URL'>URL</label> <br> <input class='inputStuff' name='URL' type='text' placeholder='URL' value='" + window.location.href + "'> <br> <input id='submitStuff' type='submit'> </form>"; document.body.appendChild(elementFront); document.getElementById('elementBack').onclick=function(){ document.body.removeChild(document.getElementById('elementFront')); document.body.removeChild(document.getElementById('elementBack')); window.onscroll = function () {}; }; })());