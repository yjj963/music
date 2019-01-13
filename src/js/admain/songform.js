{
    let view={
        el:"#form",
        init(){
            this.$el=$(this.el)
        },
        template:`
        <form>
            <div class="row">
                <label>歌名</label>
                <input type="text" name='name' value="--name--">
            </div>
            <div class="row">
                <label>歌手</label>
                <input type="text" name='singer' value="--singer--">
            </div>
            <div class="row">
                <label>外链</label>
                <input type="text" name='link' value="--link--">
            </div>
            <div class="row">
                <button type='submit'>保存</button>
            </div>
        </form>
        `,
        render(data){
            let placeholder=['name','singer','link']
            let html=this.template
            placeholder.map((string)=>{
                html=html.replace(`--${string}--`,data[string]||'')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
    let model={
        data:{name:'',singer:'',link:'',id:''},
        create(data){
            var Song=AV.Object.extend('Song')
            var song=new Song()
            //设置名称
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('link',data.link)
            return song.save().then((newSong)=> {
                // let id=newSong.id
                // let attributes=newSong.attributes
                let {id,attributes}=newSong
                // this.data.id=id
                // this.data.name=attributes.name
                // ..
                /*Object.assign(this.data,{
                    //id:id,
                    id,
                    ...attributes
                    // name:attributes.name,
                    // singer:attributes.singer,
                    // link:attributes.link
                })*/
                this.data={id,...attributes}
            },(error) =>{
                console.error(error);
            });
        }
    }
    let controller={
        init(){
            this.view=view
            this.model=model
            this.view.init()
            window.eventHub.on('upload',(data)=>{
                this.model.data=data
                this.view.render(data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                //收集数据记录到model上并保存到数据库
                let need=['name','singer','link']
                let data={}
                need.map((string)=>{
                    data[string]=this.view.$el.find(`input[name="${string}"]`).val()
                })
                this.model.create(data)
                    .then(()=>{
                        this.view.reset()
                        window.eventHub.emit('create',this.model.data)
                    })
            })
        }
    }
    controller.init(view,model)
}