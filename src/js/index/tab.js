{
    let view={
        el:'#tabs',
        init(){
            this.$el=$(this.el)
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.view.$el.on('click','.tabs-nav>li',(e)=>{
                let $li=$(e.currentTarget)
                $li.addClass('active')
                    .siblings().removeClass('active')
                let pageName=$li.attr('data-tab-name') 
                window.eventHub.emit('selectTab',pageName)
            })
            this.model=model
        }
    }
    controller.init(view,model)
}