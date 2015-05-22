requirejs.config({
    baseUrl: './scripts',
    paths: {
        'jquery': 'libs/jquery-1.11.2.min',
        'wkAlbum': 'app/jquery.wkAlbum',
        'winScroll': 'app/jquery.winScroll',
        'winModal': 'app/jquery.winModal'
    }
});

requirejs(['jquery', 'winScroll', 'winModal', 'wkAlbum'], function ($) {
    $(function () {

        $(".ui-carousel-fade").wkAlbum({
            carouselMode: "fade",
            previewAll: {
                fnPreviewAll: function () {
                    var index = $(this).index();
                    var $parents= $(this).parents(".ui-carousel-fade");

                    $.winModal({
                        hideByBackdrop:false,
                        winParents:$parents
                    });

                    $(".ui-carousel-shifting").wkAlbum({
                        showIndex: index,
                        carouselMode: "shifting",
                        width: 780,
                        height: 585,
                        thumbsList: {
                            isShow: false
                        },
                        panelDesc: {
                            isShow: true,
                            descPos: "top"
                        },
                        previewAll: {
                            isShow: false
                        }

                    });
                    $(window).winScroll({
                        fnScrollStop: function () {
                            $.winModal("hide");
                        }
                    })
                }
            }
        });


        //ŒﬁÀı¬‘Õº∆¨£¨◊Û”““∆∂Ø
        $(".ui-carousel-no").wkAlbum({
            carouselMode: "shifting",
            thumbsList: {
                isShow: false
            },
            panelDesc: {
                isShow: true,
                descPos: "top"
            },
            isDigitMutative: true,
            previewAll: {
                isShow: false
            }
        });

        //$.fn.wkAlbum.defaults.isDigitMutative=false;


    });
});

