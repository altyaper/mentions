$(document).ready(function(){

  setLayout();
  function setLayout(){
    $(".column-h").height($(window).height() - $(".top-bar").height());
  }
  $(window).resize(function(){
    setLayout();
  });


  $(".add-topic-form").submit(function(e){
    e.preventDefault();

    var data = $(this).serialize();
    $.post("/subscription",{data: data}, function(data){
      console.log(data);
    });

  });

  $(document).on('click',".media-item",function(evt){
    evt.preventDefault();

    var medio = $("#entry-medio").html(),
        templatemedio = Handlebars.compile(medio);

    var preview   = $("#entry-preview").html(),
        template = Handlebars.compile(preview);

    var context = {
      id      : $(this).data("id"),
      type    : $(this).data("type"),
      content : $(this).data("content"),
      name    : $(this).data("name"),
      title   : $(this).data("title"),
      userimg : $(this).data("userimg"),
      bigimg  : $(this).data("bigimg"),
      link    : $(this).data("link")
    };

    var html    = template(context);
    $("#display").html(html);
    var htmlmedio = templatemedio(context);
    $("#display-medio").html(htmlmedio);
  });

  var socket = io.connect(),
      Insta = Insta || {};

  var source   = $("#entry-template").html();
  var template = Handlebars.compile(source);

  Insta.App = {
   init: function() {
       this.mostRecent();
       this.getData();
   },
   getData: function() {
        var self = this;
        socket.on('show', function(data) {
            var url = data.show;
            $.ajax({
                url: url,
                type: 'POST',
                crossDomain: true,
                dataType: 'jsonp'
            }).done(function (data) {
                self.renderTemplate(data);
            });
        });

        socket.on("new tweet",function(tweet){
          self.renderTweet(tweet);
        });
    },
    mostRecent: function() {
        var self = this;
        socket.on('first', function (data) {
          var query = data;
          $.each(query,function(index,value){
            $.each(value,function(i,obj){
              self.renderIntagram(obj);
            });
          });
        });
        socket.on("first tweets",function(data){
          console.log(data);
          var tweets = data.statuses;
          $.each(tweets,function(index,value){
            self.renderTweet(value);
          });
        });
    },
    getTweetLink: function(tweet){
      var id = tweet.id_str;
      return "https://twitter.com/statuses/"+id;
    },
    renderTweet: function(tweet){
      var bigimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC";
      if(tweet.entities.media !== undefined){
        bigimg = tweet.entities.media[0].media_url_https
      }

      var context = {
        id      : tweet.id_str,
        link    : this.getTweetLink(tweet),
        time    : tweet.created_at,
        bigimg  : bigimg,
        userimg : tweet.user.profile_image_url,
        type    : "twitter",
        title   : tweet.user.screen_name,
        name    : tweet.user.name,
        content : tweet.text
      };

      var html    = template(context);
      $("#feed").prepend(html);
      // $(".item-content-text p").tweetParser({
      //   parseHashtags : true
      // });
      // $(".item-content-text p").removeClass("tweets-parse");
    },
    renderIntagram: function(obj){
      var context = {
        id      : obj.id,
        link    : obj.link,
        time    : obj.created_time,
        bigimg  : obj.images.standard_resolution.url,
        userimg : obj.images.thumbnail.url || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC",
        type    : "instagram",
        title   : obj.user.username,
        content : obj.caption.text
      };
      var html    = template(context);
      $("#feed").append(html);
    },
    giveLikeTo: function(object){
      socket.emit("liketo",{object:object});
    }
  }

  Insta.App.init();
});
