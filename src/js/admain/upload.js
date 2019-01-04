{
    let view={
        el:"#message",
        template:"<input type=''/>"
    }
    let model={
        fetch:()=>{},
        save:()=>{}
    }
    let controller={
        init:(view,model)=>{
            this.view=view
            this.model=model
        },
        bindEvents:()=>{}
    }
    controller.init(view,model)
}