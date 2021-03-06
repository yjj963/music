{
    let view={
        el:".list>ul",
        template:``,
        init(){
            this.$el=$(this.el)
        },
        render(data){
            this.$el.html('')
            let {songs,selectedSongId}=data
            let liList=songs.map((song)=>{
                let $li=$('<li></li>').text(song.name)
                    .attr('data-song-id',song.id)
                    if(song.id===selectedSongId){
                        $li.addClass('active')
                    }
                return $li
            })
            liList.map((li)=>{
                this.$el.append(li)
            })
        },
        activeItem(li){
            $(li).addClass('active')
                .siblings().removeClass('active')
        }
    }
    let model={
        data:{
            songs:[],
            selectedSongId:null
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
            this.bindEventHub()
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
                console.log('要展示的所有的')
                console.log(this.model.data)
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.$el.find('li').removeClass('active')
            })
            window.eventHub.on('update',(song)=>{
                let songs=this.model.data.songs
                for(var i=0;i<songs.length;i++){
                    if(songs[i].id===song.id){
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let songId=e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedSongId=songId
                this.view.render(this.model.data)
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