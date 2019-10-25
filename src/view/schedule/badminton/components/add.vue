<template>
    <div>
        <Modal v-model="show" title="添加" :mask-closable="false" @on-cancel="cancel(false)" width="600px">
            <Form ref="modalForm" :model="formValidate" :label-width="60">
                <FormItem label="标题">
                    <Input v-model.trim="formValidate.title" class="handle_select"></Input>
                </FormItem>
                <FormItem label="展示图片">
                    <template>
                        <div v-if="uploadImg.url" class="upload-img">
                            <img :src="uploadImg.url">
                            <div class="upload-img-cover">
                                <Icon type="ios-eye-outline" @click.native="showBigImg = true"></Icon>
                                <Icon type="ios-trash-outline" @click.native="uploadImg = {}"></Icon>
                            </div>
                        </div>
                        <Upload
                                ref="upload"
                                :show-upload-list="false"
                                :before-upload="handleUpload"
                                :on-success="uploadSuccess"
                                type="drag"
                                :action= "baseUpUrl"
                                style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="ios-camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Modal title="查看大图" v-model="showBigImg">
                            <img :src="uploadImg.url" style="width: 100%">
                        </Modal>
                    </template>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" :disabled="loading" @click="cancel(false)">取消</Button>
                <Button type="primary" :loading="loading" @click="handleSubmit">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    import { post, get } from '@/libs/axios-cfg'
    import { quillEditor } from 'vue-quill-editor';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import qs from 'qs'
    export default {
        name: 'add',
        data () {
            return {
                show: true,
                loading: false,
                formValidate:{
                    uploadUrl:'',
                    title:'',
                    img_url:'',
                },
                uploadData:{
                    type:2
                },
                uploadImg: {},
                showBigImg: false,
                uploadFile: "",
                uploadUrl:"",
                uploadList:[],
                baseUpUrl: this.$config.baseUrl.pro + '/file/upload'
            }
        },
        methods:{
            /**
             * @description 关闭Modal
             * @param reload 是否重新加载数据
             */
            cancel(reload = false) {
                this.$emit("cancel", "add", reload);
            },


            /**
             * @description 添加用户数据请求
             */
            async handleSubmit(){
                this.loading = true;
                if(this.formValidate.title !== "" || this.formValidate.uploadUrl !== ""){
                    try {
                        let res = await post(`/picture/addBadm`,{
                            title:this.formValidate.title,
                            img_url:this.formValidate.uploadUrl,
                        })
                        if(res.code == 200){
                            this.$Message.success("内容 "+this.formValidate.title+" 添加成功");
                            this.cancel(true)
                        }
                    } catch (error) {
                        this.$throw(error)
                    }
                }else{
                    this.$Message.warning("新增每一项不能为空")
                }
                this.loading = false;
            },
            /**
             * @param file
             */
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 的图片文件。'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            uploadSuccess(res, file,fileList){
                this.uploadFile = file
                console.log(res.data)
                //console.log(this.uploadFile)
                if(res.status == 1){
                    this.formValidate.uploadUrl = res.data
                }
            },
            handleUpload(file) {
                this.uploadFile = file;
                if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.handleFormatError(file);
                } else if (file.size > 2 * 1024 * 1024) {
                    this.handleMaxSize(file);
                } else {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        this.uploadImg = {
                            url: reader.result,
                            file,
                        };
                    };
                    reader.end = function (e) {
                        file.url = reader.result
                        this.uploadList.push(file)
                    }
                }
                //return false;
            },
        },
        components:{
          quillEditor
        },
        created(){

        },
    }
</script>

<style scoped>
    .upload-img{
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .upload-img img{
        width: 100%;
        height: 100%;
    }
    .upload-img-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .upload-img:hover .upload-img-cover{
        display: block;
    }
    .upload-img-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .form-item .ivu-form-item-content{
        line-height: 0 !important;
    }
</style>
