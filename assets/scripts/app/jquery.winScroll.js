;
(function ($,win) {
    $.fn.winScroll = function (options) {

        var settings = $.extend(true, {}, $.fn.winScroll.defaults, options);

        var scrollHeight = settings.scrollHeight;
        var fnScrollStop = settings.fnScrollStop;
        var timeRate = settings.timeRate;
        return this.each(function () {

            var scrollTimeout = null;
            var scrollHandler = null;
            $(win).scroll(function () {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollTimeout = setTimeout(scrollHandler, timeRate);
            });
            scrollHandler = function () {
                if ($(win).scrollTop() > scrollHeight) {
                    fnScrollStop();
                }
            };
        });
    };
    // 暴露插件的默认配置
    $.fn.winScroll.defaults = {
        scrollHeight: 300,
        timeRate:200,
        fnScrollStop: $.noop
    };

})(jQuery,window);