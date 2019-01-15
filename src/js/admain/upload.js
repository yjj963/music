{
    let view={
        el:"#message"
    }
    let model={
        data:{
            status:'open'
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.initQiniu()
        },
        initQiniu(){
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: 'uploadButton',       //上传选择的点选按钮，**必需**
                uptoken_url : 'http://localhost:8888/uptoken',
                domain: 'pkt6vbowa.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '40mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'uploadContainer',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file)=> {
                        // 每个文件上传前,处理相关的事情
                        if(this.model.data.status==='closed'){console.log(window.x)
                            return false;
                        }else{
                            this.model.data.status='closed'
                        }
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                        window.eventHub.emit('beforeload')
                    },
                    'FileUploaded': (up, file, info) =>{
                        this.model.data.status='open'
                         var domain = up.getOption('domain');
                         var res = JSON.parse(info.response);
                         var sourceLink = 'http://'+domain+'/' + encodeURIComponent(res.key); //获取上传成功后的文件的Url
                         window.eventHub.emit('upload',{
                             'link':sourceLink,
                             'name':res.key
                         })
                         window.eventHub.emit('afterload')
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });
        },
        bindEventsHub(){
            
        }
    }
    controller.init(view,model)
}