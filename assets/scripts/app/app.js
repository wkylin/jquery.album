$(function () {

    $(".ui-carousel-fade").wkAlbum({
        carouselMode: "fade",
        previewAll: {
            fnPreviewAll: function () {
                var index = $(this).index();
                var $parents = $(this).parents(".ui-carousel-fade");

                $.winModal({
                    hideByBackdrop: false,
                    winParents: $parents
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


    //������ͼƬ�������ƶ�
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
});