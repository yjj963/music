{
    let view={
        el:"#song",
        template:`
        <audio src="{{link}}"></audio>
        <div>
            <button class="play">播放</button>
            <button class="pause">暂停</button>
        </div>
        `,
        init(){
            this.$el=$(this.el)
        },
        render(song){
            $(this.el).html(this.template.replace("{{link}}",song.link))
        },
        play(){
            let audio=this.$el.find("audio")[0]
            audio.play()
        },
        pause(){
            let audio=this.$el.find("audio")[0]
            audio.pause()
        }
    }
    let model={
        data:{
            songs:{
                id:'',
                name:'',
                singer:'',
                link:''
            }
        },
        get(id){
            var query=new AV.Query('Song')
            return query.get(id).then((song)=>{
                console.log(song)
                return {id:song.id,...song.attributes}
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            let id=this.getSongId()
            this.model.get(id).then((song)=>{
                this.view.render(song)
            })
            this.bindEvent()
        },
        getSongId(){
            let search=window.location.search
            if(search.indexOf('?')===0){
                search=search.substring(1)
            }
            let array=search.split('&').filter((v=>v))
            let id=''
            for(let i=0;i<array.length;i++){
                let kv=array[i].split('=')
                let key=kv[0]
                let value=kv[1]
                if(key==='id'){
                    id=value
                    break
                }
            }
            return id
        },
        bindEvent(){
            this.view.$el.on('click','.play',()=>{
                this.view.play()
            })
            this.view.$el.on('click','.pause',()=>{
                this.view.pause()
            })
        }
    }
    controller.init(view,model)
}