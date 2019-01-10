{
    let view={
        el:"#form"
    }
    let model={}
    let controller={
        init(){
            this.view=view
            this.model=model
        }
    }
    controller.init(view,model)
}