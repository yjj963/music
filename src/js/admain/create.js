{
    let view={
        el:".create"
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