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
                <label>封面</label>
                <input type="text" name='cover' value="--cover--">
            </div>
            <div class="row">
                <label>歌词</label>
                <textarea name="lyrics" cols="30" rows="10">--lyrics--</textarea>
            </div>
            <div class="row">
                <button type='submit'>保存</button>
            </div>
        </form>
        <div id="uploadStatus"></div>
        `,
        render(data){
            let placeholder=['name','singer','link','cover','lyrics']
            let html=this.template
            console.log(data)
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
        data:{},
        create(data){
            var Song=AV.Object.extend('Song')
            var song=new Song()
            //设置名称
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('link',data.link)
            song.set('cover',data.cover)
            song.set('lyrics',data.lyrics)
            return song.save().then((newSong)=> {
                let {id,attributes}=newSong
                Object.assign(this.data,{
                    id,
                    ...attributes
                })
                //this.data={id,...attributes}
            });
        },
        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id);
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('link', data.link);
            song.set('cover',data.cover)
            song.set('lyrics',data.lyrics)
            return song.save().then((response)=>{
                Object.assign(this.data, data)
                return response
              },(error) =>{
                console.error(error);
            })
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
                this.model.data=songData
                this.view.render(songData)
            })
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data={name:'',singer:'',link:'',id:'',cover:'',lyrics:''}
                }else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                //收集数据记录到model上并保存到数据库
                let need=['name','singer','link','cover','lyrics']
                let data={}
                need.map((string)=>{
                    data[string]=this.view.$el.find(`[name="${string}"]`).val()
                })
                if(this.model.data.id){
                    this.model.update(data)
                        .then(()=>{
                            window.eventHub.emit('update',this.model.data)
                        })
                }else{
                    this.model.create(data)
                        .then(()=>{
                            this.view.reset()
                            window.eventHub.emit('create',JSON.parse(JSON.stringify(this.model.data)))
                            this.model.data={}
                        })
                }
            })
        }
    }
    controller.init(view,model)
}