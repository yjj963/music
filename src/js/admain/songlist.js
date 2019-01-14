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
            console.log(songs)
            let liList=songs.map((song)=>{
                return $('<li></li>').text(song.name)
            })
            console.log(liList)
            liList.map((li)=>{
                this.$el.append(li)
            })
            //this.$el.html(this.template)
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
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
            //this.view.render(this.model.data)
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}