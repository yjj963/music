{
    let view={
        el:"#form",
        template:`
        <div class="row">
            <label>歌名</label>
            <input type="text" value="--name--">
        </div>
        <div class="row">
            <label>歌手</label>
            <input type="text" value="--singer--">
        </div>
        <div class="row">
            <label>外链</label>
            <input type="text" value="--link--">
        </div>
        <div class="row">
            <button>保存</button>
        </div>
        `,
        render(data){
            let placeholder=['name','singer','link']
            let html=this.template
            placeholder.map((string)=>{
                html=html.replace(`--${string}--`,data[string]||'')
            })
            $(this.el).html(html)
        }
    }
    let model={}
    let controller={
        init(){
            this.view=view
            this.model=model
            window.eventHub.on('upload',(data)=>{
                this.view.render(data)
            })
            //this.bindEvents()
        },
        
    }
    controller.init(view,model)
}