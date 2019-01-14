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
            this.$el.html('')
            //let songs=data.songs
            let {songs}=data
            let liList=songs.map((song)=>{
                return $('<li></li>').text(song.name)
                    .attr('data-song-id',song.id)
            })
            liList.map((li)=>{
                this.$el.append(li)
            })
            //this.$el.html(this.template)
        },
        activeItem(li){
            $(li).addClass('active')
                .siblings().removeClass('active')
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
        init(){
            this.view=view
            this.model=model
            this.view.init()
            this.getAllSongs()
            this.bindEvents()
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.$el.find('li').removeClass('active')
            })
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
                console.log('要展示的所有的')
                console.log(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let songId=e.currentTarget.getAttribute('data-song-id')
                let songs=this.model.data.songs
                for(var i=0;i<songs.length;i++){
                    if(songs[i].id===songId){
                        var songData=songs[i]
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(songData)))
            })
        }
    }
    controller.init(view,model)
}