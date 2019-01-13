{
    let view={
        el:".list>ul",
        template:`
            <li>
                <div class="pic"></div>
                <div class="text">
                    <h1>从无到有</h1>
                    <p><span class="icon"></span>毛不易</p>
                </div>
            </li>
            <li>
                <div class="pic"></div>
                <div class="text">
                    <h1>像我这样的人</h1>
                    <p><span class="icon"></span>毛不易</p>
                </div>
            </li>
        `,
        init(){
            this.$el=$(this.el)
        },
        render(data){
            this.$el.html(this.template)
        }
    }
    let model={
        
    }
    let controller={
        init(){
            this.view=view
            this.model=model
            this.view.init()
            this.view.render(this.model.data)
            window.eventHub.on('create',(data)=>{
                
            })
        }
    }
    controller.init(view,model)
}