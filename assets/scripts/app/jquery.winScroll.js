;
(function ($) {
    $.fn.winScroll = function (options) {

        var settings = $.extend(true, {}, $.fn.winScroll.defaults, options);

        var scrollHeight = settings.scrollHeight;
        var fnScrollStop = settings.fnScrollStop;
        var timeRate = settings.timeRate;
        return this.each(function () {

            var scrollTimeout = null;
            var scrollHandler = null;
            $(window).scroll(function () {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = null;
                }
                scrollTimeout = setTimeout(scrollHandler, timeRate);
            });
            scrollHandler = function () {
                if ($(window).scrollTop() > scrollHeight) {
                    fnScrollStop();
                }
            };
        });
    };
    // ±©Â¶²å¼şµÄÄ¬ÈÏÅäÖÃ
    $.fn.winScroll.defaults = {
        scrollHeight: 300,
        timeRate:200,
        fnScrollStop: $.noop
    }

})(jQuery);