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
                $(e.currentTarget).addClass('active')
                    .siblings().removeClass('active')
            })
            this.model=model
        }
    }
    controller.init(view,model)
}