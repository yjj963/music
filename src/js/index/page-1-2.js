{
    let view={
        el:'#lastestMusic',
        init(){
            this.$el=$(this.el)
        },
        render(data){
            let songs=data.songs
            
            songs.map((song)=>{
                let $li=$(`
                <li>
                    <h3>${song.name}</h3>
                    <p>
                        
                        ${song.singer}
                    </p>
                    <a>
                        
                    </a>
                </li>
                `)
                //$li.append($('.lastestMusicList'))
                this.$el.find('ol.lastestMusicList').append($li)
            })
            
        }
    }
    let model={
        data:{
            songs:[]
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs) =>{
                this.data.songs=songs.map((song)=>{
                    let id=song.id
                    return {id,...song.attributes}
                })
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.init()
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}