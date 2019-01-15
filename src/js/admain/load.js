{
    let view={
        el:"#site-loading",
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforeload',()=>{
                this.view.show()
            })
            window.eventHub.on('afterload',()=>{
                this.view.hide()
            })
        }
    }
    controller.init(view)
}