;
(function ($,win) {



    var methods = {

        init: function (options) {
            var settings = $.extend(true, {}, $.winModal.defaults, options);

            var modalTitle = settings.modalTitle;
            var modalBody = settings.modalBody;
            var showBackdrop = settings.isShowBackdrop;
            var hideByBackdrop = settings.hideByBackdrop;

            var winParents= settings.winParents;

            var scrollTop = $(win).scrollTop();
            var $that = null;

            var uiShifting;

            //组建DOM结构
            var modal = '<div class="ui-modal">' +
                '<div class="ui-modal-content">' +
                '<div class="ui-modal-header">' +
                '<div class="ui-modal-title">' + modalTitle + '</div>' +
                '<div class="ui-modal-close">ui-modal-close</div></div>' +
                '<div class="ui-modal-body">' +
                '</div></div></div>';

            //DOM
            $(modal).appendTo($("body"));
            $(modalBody).clone().appendTo($(".ui-modal-body"));

            //GET DOM
            $that = $(".ui-modal");
            var $tabsContent= $that.find(".ui-tabs-content");
            var $albumBox= winParents.parents("body").find(".ui-album-box");
            var ids = winParents.data("index");

            $albumBox.each(function(i){

                var $img = $albumBox.eq(i).find(".ui-panel-list img");

                var imgArray = [], imgAltArray = [];

                $img.each(function (i, item) {
                    imgArray[i] = $(item).attr("src");
                    imgAltArray[i] = $(item).attr("alt");
                });

                uiShifting = '<div class="ui-tabs-content-item"><div class="ui-album-box ui-carousel-shifting"><div class="ui-album-panel"><ul class="ui-panel-list">';
                for (var j = 0; j < imgArray.length; j++) {
                    uiShifting += '<li><img src="' + imgArray[j] + '" alt="' + imgAltArray[j] + '"/></li>';
                }
                uiShifting += '</ul></div></div></div>';

                $(uiShifting).appendTo($tabsContent);
            });

            //增加当时Class
            $that.find(".ui-tabs-sub-item").each(function(){
                var $this=$(this);
                var index= $this.data("index");
                if(index===ids){
                    $this.addClass("ui-tabs-sub-active");
                }
                $this.find("span").text($albumBox.eq(index).find(".ui-panel-list img").size());
            });

            //显示
            $that.css({"top": scrollTop}).fadeIn(function () {
                $that.find(".ui-tabs-content-item").eq(ids).show();
                $that.find(".ui-tabs").show();
            });


            //TABS ITEM 显示与隐藏
            $that.on("click",".ui-tabs-sub-item",function(){
                $that.find(".ui-tabs-sub-item").removeClass("ui-tabs-sub-active");
                $(this).addClass("ui-tabs-sub-active");
                $that.find(".ui-tabs-content-item").hide();
                $that.find(".ui-tabs-content-item").eq($(this).data("index")).show();
            });

            //增加背景幕
            if (showBackdrop) {
                $('<div class="ui-modal-backdrop"></div>').height($("body").height()).appendTo($("body"));
                if (hideByBackdrop) {
                    $(".ui-modal-backdrop").on("click", function () {
                        $that.remove();
                        $(this).fadeOut().remove();
                    });
                }
            }

            //close
            $that.find(".ui-modal-close").on("click", function () {
                $that.remove();
                if (showBackdrop) {
                    $(".ui-modal-backdrop").fadeOut().remove();
                }
            });
        },
        hide: function () {
            $(".ui-modal").remove();
            $(".ui-modal-backdrop").fadeOut().remove();
        }
    };


    $.winModal = function (method) {
        // 方法调用
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method' + method + 'does not exist on jQuery');
        }
    };


    // 暴露插件的默认配置
    $.winModal.defaults = {
        modalTitle: "弹出窗口标题",
        modalBody: ".ui-tabs",
        isShowBackdrop: true,
        hideByBackdrop: true,
        winParents:null
    };

})(jQuery,window);