{
    let view={
        el:"#list",

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