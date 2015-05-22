;
(function ($) {
    $.fn.wkAlbum = function (options) {

        var settings = $.extend(true, {}, $.fn.wkAlbum.defaults, options);

        var showIndex = settings.showIndex;
        var carouselMode = settings.carouselMode;
        var isPanelNav = settings.isPanelNav;
        var isThumbsList = settings.thumbsList.isShow;
        var thumbsWidth = settings.thumbsList.width;
        var thumbsHeight = settings.thumbsList.height;
        var isPanelDesc = settings.panelDesc.isShow;
        var descPos = settings.panelDesc.descPos;
        var isDigitMutative = settings.isDigitMutative;
        var isPreviewAll = settings.previewAll.isShow;
        var fnPreviewAll = settings.previewAll.fnPreviewAll;

        var width = settings.width;
        var height = settings.height;

        return this.each(function () {

            var $albumBox = $(this);
            var $albumPanel, $panelList, $panelItem, $overlayPlace;
            var $panelText, $panelDigit, $digitMutative, $digitAmount, $panelPrev, $panelNext;
            var $thumbsList, $thumbsItem, $thumbsPrev, $thumbsNext;
            var $panelItemImg;

            var panelListSize;
            var thumbsItemWidth;
            var panelWidth, panelHeight, panelItemWidth, panelItemHeight;



            $albumPanel = $albumBox.find(".ui-album-panel");
            $panelList = $albumBox.find(".ui-panel-list");
            $panelItem = $panelList.find("li");
            $panelItemImg = $panelItem.find("img");


            //PanelItemSize
            panelListSize = $panelItem.size();
            panelWidth = panelItemWidth = width;
            panelHeight = panelItemHeight = height;

            $albumPanel.width(panelWidth).height(panelHeight);
            $panelItem.width(panelItemWidth).height(panelItemHeight);

            $panelItemImg.css({"max-width": panelWidth, "max-height": panelHeight});


            //计数器
            var index = (showIndex >= panelListSize) ? 0 : showIndex;

            //显示总数及当前页面
            if (isDigitMutative) {
                var digit = '<div class = "ui-panel-digit" >' +
                    '<span class = "ui-panel-mutative" ></span>/ <span class="ui-panel-amount"></span>' +
                    '</div>';
                $(digit).appendTo($albumPanel);
                $digitMutative = $albumBox.find(".ui-panel-mutative");
                $digitAmount = $albumBox.find(".ui-panel-amount");
                $panelDigit = $albumBox.find(".ui-panel-digit");

            }

            //显示图片描述信息
            if (isPanelDesc) {
                var desc = "";

                if (!$albumBox.find(".ui-overlay-place").size()) {
                    desc = '<div class="ui-overlay-place">overlay-place</div>';
                }
                desc += '<div class= "ui-panel-text" ></div>';
                $(desc).appendTo($albumPanel);
                $panelText = $albumBox.find(".ui-panel-text");
                $overlayPlace = $albumBox.find(".ui-overlay-place");
                if (descPos == "bottom") {
                    $panelText.css({"bottom": 0});
                    $overlayPlace.css({"bottom": 0});
                    if ($panelDigit) {
                        $panelDigit.css({"bottom": 0});
                    }
                } else {
                    $panelText.css({"top": 0});
                    $overlayPlace.css({"top": 0});
                    if ($panelDigit) {
                        $panelDigit.css({"top": 0});
                    }
                }
            }

            //初始化
            showPanelItem(index);


            //显示Panel导航
            if (isPanelNav) {
                var panelNav = '<div class="ui-panel-prev">前一张</div><div class = "ui-panel-next"> 后一张 </div>';
                $(panelNav).appendTo($albumPanel);
                $panelPrev = $albumBox.find(".ui-panel-prev");
                $panelNext = $albumBox.find(".ui-panel-next");

                $panelPrev.css({"top": (panelHeight - $panelPrev.height()) / 2});
                $panelNext.css({"top": (panelHeight - $panelPrev.height()) / 2});
                $albumPanel.on("mouseover", function () {
                    $panelPrev.show();
                    $panelNext.show();
                }).on("mouseout", function () {
                    $panelPrev.hide();
                    $panelNext.hide();
                });

                //Panel左右导航事件
                $panelPrev.on("click", function () {
                    if (index != 0) {
                        showPrev();
                    }
                });

                $panelNext.on("click", function () {
                    if (index != panelListSize - 1) {
                        showNext();
                    }
                });
            }

            //显示缩略图
            if (isThumbsList) {
                var thumbsList = '<div class="ui-album-thumbs">' +
                    '<ul class="ui-thumbs-list"></ul>' +
                    '<div class="ui-thumbs-prev">前一张</div>' +
                    '<div class="ui-thumbs-next">后一张</div>' +
                    '</div>';
                $(thumbsList).appendTo($albumBox);
                $thumbsList = $albumBox.find(".ui-thumbs-list");
                $panelItem.clone().removeAttr("style").find("img").css({
                    "max-width": thumbsWidth,
                    "max-height": thumbsHeight
                }).end().appendTo($thumbsList);


                $thumbsItem = $thumbsList.find("li");
                $thumbsPrev = $albumBox.find(".ui-thumbs-prev");
                $thumbsNext = $albumBox.find(".ui-thumbs-next");

                $thumbsItem.eq(index).addClass("ui-thumbs-active");

                //设置缩略图的宽度
                thumbsItemWidth = $thumbsItem.outerWidth(true);
                $thumbsList.width(thumbsItemWidth * panelListSize);

                //缩略图左右导航事件
                $thumbsPrev.on("click", function () {
                    if (index != 0) {
                        showPrev();
                    }
                });

                $thumbsNext.on("click", function () {
                    if (index != panelListSize - 1) {
                        showNext();
                    }
                });

                //缩略图片点击事件
                $thumbsItem.on("click", function () {
                    index = $(this).index();
                    if (!$(this).hasClass("ui-thumbs-active")) {
                        showPanelItem(index);
                    }
                });
            }

            //Preview All
            if (isPreviewAll) {
                $panelList.on("click", "li", fnPreviewAll);
            }


            //导航Next
            function showNext() {
                index++;
                if (index >= panelListSize) {
                    index = panelListSize - 1;
                }
                showPanelItem(index);
            }

            //导航Prev
            function showPrev() {
                if (index == 0) {
                    index = 1;
                }
                index--;
                showPanelItem(index);
            }

            //私有函数
            function showPanelItem(item) {
                var $imgItem= $panelItem.eq(item).find("img")
                var alt = $imgItem.attr("alt");
                var panelItemWidth = 0;
                if (carouselMode == "fade") {
                    $panelItem.hide();
                    $imgItem.fadeIn().css({"opacity":1});
                    $panelItem.eq(item).fadeIn();

                } else {
                    $panelItem.css({"display": "table-cell"});
                    panelItemWidth = $panelItem.width();
                    $panelList.width(panelItemWidth * panelListSize);
                    $imgItem.show();
                    $panelList.stop(true, true).animate({
                        "margin-left": -panelItemWidth * item
                    });
                }


                //移动缩略图片
                if (isThumbsList) {
                    if ($thumbsItem) {
                        $thumbsItem.removeClass("ui-thumbs-active");
                        $thumbsItem.eq(item).addClass("ui-thumbs-active");
                    }
                    if (panelListSize > 4 && $thumbsList) {
                        if (item < panelListSize - 2) {

                            $thumbsList.stop(true, true).animate({
                                "margin-left": (-thumbsItemWidth * (item - 2 < 0 ? 0 : (item - 2)))
                            });
                        } else {
                            $thumbsList.stop(true, true).animate({
                                "marginLeft": (-thumbsItemWidth * (panelListSize - 4))
                            });
                        }
                    }
                }


                if (isPanelDesc) {
                    $panelText.text(alt);
                }
                if (isDigitMutative) {
                    $digitMutative.text(item + 1);
                    $digitAmount.text(panelListSize);
                }

            }
        });
    };
    // 暴露插件的默认配置
    $.fn.wkAlbum.defaults = {
        width:500,
        height:375,
        showIndex: 0,
        carouselMode: "fade", //shifting
        isPanelNav: true,
        thumbsList: {
            isShow: true,
            width: 120,
            height: 90
        },
        panelDesc: {
            isShow: true,
            descPos: "bottom" //"top"
        },
        isDigitMutative: true,
        previewAll: {
            isShow: true,
            fnPreviewAll: $.noop
        }

    }

})(jQuery);