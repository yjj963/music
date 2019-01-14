{
    let view={
        el:".create",
        init(){
            this.$el=$(this.el)
        }
    }
    let model={}
    let controller={
        init(){
            this.view=view
            this.model=model
            this.view.init()
            this.active()
            window.eventHub.on('create',()=>{
                this.deactive()
            })
            window.eventHub.on('select',()=>{
                //this.deactive()
            })
        },
        active(){
            this.view.$el.addClass('active')
        },
        deactive(){
            this.view.$el.removeClass('active')
        }
    }
    controller.init(view,model)
}