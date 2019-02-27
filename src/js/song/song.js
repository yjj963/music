{
    let view={}
    let model={
        data:{
            id:'',
            name:'',
            singer:'',
            url:''
        },
        setId(id){
            this.data.id=id
        },
        get(){
            var query=new AV.Query('Song')
            query.get(this.data.id).then((song)=>{
                console.log(song)
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            let id=this.getSongId()
            this.model.setId(id)
            this.model.get()
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
        }
    }
    controller.init(view,model)
}
