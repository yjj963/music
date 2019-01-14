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
            if(data.id){
                this.$el.prepend($('<h1>编辑歌曲</h1>'))
            }else{
                this.$el.prepend($('<h1>新建歌曲</h1>'))
            }
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
                let {id,attributes}=newSong
                Object.assign(this.data,{
                    id,
                    ...attributes
                })
                //this.data={id,...attributes}
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
            this.view.render(this.model.data)
            this.bindEventHub()
            this.bindEvents()
        },
        bindEventHub(){
            window.eventHub.on('upload',(data)=>{
                this.model.data=data
                this.view.render(data)
            })
            window.eventHub.on('select',(songData)=>{
                this.view.render(songData)
            })
            window.eventHub.on('new',()=>{
                this.view.render(this.model.data)
            })
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
                        //深拷贝
                        let string=JSON.stringify(this.model.data)
                        let object=JSON.parse(string)
                        window.eventHub.emit('create',object)
                    })
            })
        }
    }
    controller.init(view,model)
}