!function(){
    var $nav=$('.siteNav li')
    for(var i=0;i<$nav.length;i++){
        var li=$nav[i]
        $(li).on('click',function(e){
            var idx=$(this).index()
            $(this).addClass('active').siblings().removeClass('active')
            $('.tabContent>li').eq(idx).addClass('active').siblings().removeClass('active')
        })
    }
}();