$(document).ready(function(){
  var childMap;
  var mapObj=[];
  idNameMap={};
  function process_bookmark(bookmarks,parent) {
    var t1 = Date.now();
    for (var i =0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
            mapObj.push({"parent" : parent, "title" : bookmark.title, "url" : bookmark.url});
            idNameMap[parent]=bookmark.parentId;
            //console.log("parentId : " + bookmark.parentId + " parent : " + parent);
        }
        if (bookmark.children) {
            process_bookmark(bookmark.children,bookmark.title);
        }
    }
    var t2 = Date.now();
    console.log(t2-t1);
  };
  $(document).ready(function(){
    chrome.bookmarks.getTree( process_bookmark );
    console.log("hello");
    $("#checkPage").remove();
    setTimeout(
      function() 
      {
        var par = mapObj[0].parent;
        var k=0;
        var ol=$("<ul></ul>");
        for(var i = 0;i<mapObj.length;i++){
          if(par != mapObj[i].parent){
            var head = $("<div><h3 id='"+k+"'>"+par+"<span> --> Click to open All links in new tab</span></h3></div>");
            k++;
            $('body').append(head);
            $('body').append(ol);
            par = mapObj[i].parent;
            ol=$("<ul></ul>");
          }
          else{
            if((mapObj[i].url).includes("http"))
              $(ol).append("<li><a href='"+mapObj[i].url+"' target='_blank' class='"+k+"'>"+mapObj[i].title+"</a></li>");
          }
        }
        $("div").click(function(){
          var divId = $(this).find('h3').attr('id');
          var links = $('body').find('.'+divId);
          for(var i=0;i<links.length;i++){
            window.open($(links[i]).attr("href"), $(links[i]).attr('_blank'));
          }
        });
      }, 200);
  });
    //hang on event of form with id=myform
  $("#createBookmark").submit(function(e) {
      e.preventDefault();
      var result = { };
      $.each($('#createBookmark').serializeArray(), function() {
          result[this.name] = this.value;
      });
      if(idNameMap[result.folderName]){
         chrome.bookmarks.create({'parentId': idNameMap[result.folderName],
                                 'title': result.titleOfthePage,
                                 'url': result.urlOfThePage});
      }
      else{
        chrome.bookmarks.create({'parentId': '1',
                                 'title': result.titleOfthePage,
                                 'url': result.urlOfthePage});
      }
  });
});