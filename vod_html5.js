$("#list_nav_parent").after('<a id="TLE_html5_player" class="page_list" href="#" title="HTML5播放">'
                              +'<span>HTML5播放器</span>'
                              +'<span class="p_r"></span>'
                            +'</a>');
$("#TLE_html5_player").click(function() {
  document.cookie = "html5_player=1";
  html5player();
});

function html5player() {
  function play(url) {
    url = url.replace(/&n=\w+/, "&n=08586C0FD0F6390000").replace(/&p=\d+/, "")+"&p=1&xplaybackid=0";
    $("#xl_vod_fx_flash_box").attr("src", url);
    $("#original_url").html('mplayer播放:'+'<input value="'+play_with_mplayer(url)+'" />');
    $("#original_url input").attr("style", "background:#777;border:0;width:400px;");
  }

  if (typeof XL_CLOUD_FX_INSTANCE != "undefined" && XL_CLOUD_FX_INSTANCE.curPlay) {
    var list = XL_CLOUD_FX_INSTANCE.curPlay.vodinfo_list
    $("#XL_CLOUD_VOD_PLAYER").empty();
    if (list.length == 0) {
      $("#XL_CLOUD_VOD_PLAYER").append('<img src="http://vod.xunlei.com/img/play_bg.jpg" width="100%" height="100%"><div style="position:absolute;left:0;top:46%;text-align:center;font-size:14px;color:#FFF;margin: 0;width:100%;height:22px;">云点播尚未转码完成。</div>');
      return ;
    };
    $("#mycopyer").hide();
    $("#XL_CLOUD_VOD_PLAYER").append('<video id="xl_vod_fx_flash_box" width="100%" height="94%" style="z-index: 100;" controls="controls" autoplay="true"></video>'
                +'<div id="xl_button_box" style="width: 100%; height: 6%; line-height: 22px; text-align: right; ">'
                +'</div>');
    list.forEach(function(n, i) {
      console.log(n);
      var str = "";
      switch(n.spec_id) {
        case 225536:
        case 226048:
          str = "360P";
          break;
        case 282880:
        case 283392:
          str = "480P";
          break;
        case 356608:
        case 357120:
          str = "720P";
          break;
        default:
          str = "不知什么清";
          break;
      };
      $('<button style="margin-right:5px;">'+str+'</button>').appendTo("#xl_button_box").click(function() {
        $("#xl_button_box button").each(function(n, e) {
          e = $(e);
          e.text(e.text().replace("• ", ""));
        });
        var _this = $(this);
        _this.text("• "+_this.text());
        play(n.vod_url); 
      });
    });

    var tmp = $("#xl_button_box button:last");
    tmp.text("• "+tmp.text());
    play(list[list.length-1].vod_url);
  }
};

function play_with_mplayer(url) {
  var ismac = (navigator.platform.indexOf("Mac") == 0);
  var userid = url.match(/&ui=(\d+)/)[1];
  if (ismac) {
    return "open -a 'MPlayerX.app' --args -ExtraOptions --http-header-fields 'cookie: user="+userid+"' -url '"+url+"'";
  } else {
    return "mplayer -http-header-fields 'cookie: userid="+userid+"' '"+url+"'\n";
  }
};
