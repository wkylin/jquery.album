;
(function ($,win) {
    $.fn.winScroll = function (options) {

        var settings = $.extend(true, {}, $.fn.winScroll.defaults, options);

        var scrollHeight = settings.scrollHeight;
        var fnScrollStop = settings.fnScrollStop;
        var timeRate = settings.timeRate;
        return this.each(function () {

            var $this= $(this);
            var scrollTimeout = null;
            var scrollHandler = null;
            $this.scroll(function () {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollTimeout = setTimeout(scrollHandler, timeRate);
            });
            scrollHandler = function () {
                if ($this.scrollTop() >= scrollHeight) {
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