{
    let view={
        el:"#song-wrapper",
        init(){
            this.$el=$(this.el)
        },
        render(data){
            let {song,status}=data
            if(this.$el.find('audio').attr('src')!==song.link){
                this.$el.find('audio').attr('src',song.link)
                let audio=this.$el.find('audio')[0]
                audio.onended=()=>{
                    window.eventHub.emit('end')
                }
                audio.ontimeupdate = ()=> { 
                    this.showLyric(audio.currentTime)
                }
            }
            if(status==='playing'){
                this.$el.find('.disc-container').addClass('playing')
                this.$el.find('.pointer').addClass('active')
            }else{
                this.$el.find('.disc-container').removeClass('playing')
                this.$el.find('.pointer').removeClass('active')
            }  
            $('head').append(`<style>#song-wrapper::before{ background:url(${song.cover}) }</style>`);
            this.$el.find('.cover').attr('src',song.cover)
            this.$el.find('.song-description>h1').text(song.name)
            let {lyrics}=song
            let array=lyrics.split('\n').map((string)=>{
                //console.log(string)
                let p=document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches =string.match(regex)
                if(matches){
                    //console.log(matches)
                  p.textContent = matches[2]
                  let time = matches[1]
                  let parts = time.split(':')
                  let minutes = parts[0]
                  let seconds = parts[1]
                  let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
                  p.setAttribute('data-time', newTime)
                }else{
                  p.textContent = string
                }
                this.$el.find('.lyric>.lines').append(p)
            })        
        },
        showLyric(time){
            let allP = this.$el.find('.lyric>.lines>p')
            let p 
            for(let i =0;i<allP.length;i++){
              if(i===allP.length-1){
                p = allP[i]
                break
              }else{
                let currentTime = allP.eq(i).attr('data-time')
                let nextTime = allP.eq(i+1).attr('data-time')
                if(currentTime <= time && time < nextTime){
                    p = allP[i]
                    let pHeight = p.getBoundingClientRect().top
                    let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
                    let height = pHeight - linesHeight
                    this.$el.find('.lyric>.lines').css({
                        transform: `translateY(${- (height)}px)`
                    })
                    $(p).addClass('active').siblings('.active').removeClass('active')
                    break
                }
              }
            }
            
          },
        play(){
            let audio=this.$el.find("audio")[0].play()
        },
        pause(){
            let audio=this.$el.find("audio")[0].pause()
        }
    }
    let model={
        data:{
            song:{
                id:'',
                name:'',
                singer:'',
                link:'',
                cover:'',
                lyrics:''
            },
            status:'paused'
        },
        get(id){
            var query=new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data.song,{id:song.id,...song.attributes})
                return song
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
                this.view.render(this.model.data)
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
            window.eventHub.on('end',()=>{
                this.model.data.status='paused'
                this.view.render(this.model.data)
            })
            this.view.$el.on('click','.icon-wrapper',()=>{
                if(this.model.data.status==='paused'){
                    this.view.play()
                    this.model.data.status='playing'
                    this.view.render(this.model.data)
                }else{
                    this.view.pause()
                    this.model.data.status='paused'
                    this.view.render(this.model.data)
                }
            })
        }
    }
    controller.init(view,model)
}