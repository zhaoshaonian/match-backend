<template>
    <div>
        <Modal v-model="show" title="修改" :mask-closable="false" @on-cancel="cancel(false)" width="800px">
            <Form ref="modalForm" :model="formValidate" :label-width="60">
                <FormItem label="文章标题">
                    <Input v-model.trim="formValidate.title" class="handle_select"></Input>
                </FormItem>
                <FormItem label="上传图片">
                    <template>
                        <div v-if="uploadImg.url || formValidate.img_url" class="upload-img">
                            <img :src="uploadImg.url || formValidate.img_url">
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
                            <img :src="uploadImg.url || formValidate.img_url" style="width: 100%">
                        </Modal>
                    </template>
                </FormItem>
                <FormItem label="文章摘要">
                    <Input v-model.trim="formValidate.zhaiyao" class="handle_select"></Input>
                </FormItem>
                <!--<quill-editor ref="myTextEditor" v-model="formValidate.content"></quill-editor>-->
                <quill-editor v-model="formValidate.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
                <el-upload
                        class="upload-uploader"
                        :action="baseUpUrl"
                        :show-file-list="false"
                        :on-success="uploadQuillSuccess"
                        :on-error="uploadQuillError"
                        style="display: none"
                        :before-upload="beforeQuillUpload">
                </el-upload>
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

    // 工具栏配置
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ]

    import qs from 'qs'
    export default {
        name: 'update',
        props: {
            uid:{
                type:Number,
                default:{}
            }
        },
        data () {
            return {
                show: true,
                loading: false,
                formValidate:{
                    uploadUrl:'',
                    title:'',
                    img_url:'',
                    content:'',
                    zhaiyao:''
                },
                uploadData:{
                    type:2
                },
                uploadImg: {},
                showBigImg: false,
                uploadFile: "",
                uploadUrl:"",
                uploadList:[],
                baseUpUrl: this.$config.baseUrl.pro + '/file/upload',
                quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                editorOption: {
                    placeholder: '',
                    theme: 'snow',  // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector('.upload-uploader input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        created(){
            this.getUserInfo()
        },
        methods:{
            /**
             * @description 关闭Modal
             * @param reload 是否重新加载数据
             */
            cancel(reload = false) {
                this.$emit("cancel", "update", reload);
            },
            /**
             * @description 获取用户列表
             */
            async getUserInfo(){
                this.loading = true;
                try {
                    let res = await post(`/news/get`,{
                        id:this.uid
                    })
                    if(res.data != null){
                        this.formValidate = res.data
                    }
                } catch (error) {
                    this.$throw(error)
                }
                this.loading = false;
            },

            /**
             * @description 数据请求
             */
            async handleSubmit(){
                let uploadUrl = "";
                if(this.formValidate.uploadUrl == "" || this.formValidate.uploadUrl == null){
                    uploadUrl = this.formValidate.img_url
                }else{
                    uploadUrl = String(this.formValidate.uploadUrl)
                };
                //获取当前时间
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let houes = date.getHours();            //时
                let minutes = date.getMinutes();          //分
                let seconds = date.getSeconds();          //秒
                if (month < 10) { month = "0" + month; }
                if (day < 10) { day = "0" + day; }
                if (houes < 10) { houes = "0" + houes }
                if (minutes < 10) { minutes = "0" + minutes }
                if (seconds < 10) { seconds = "0" + seconds }
                let gmtDatetime = year + "-" + month + "-" + day + " " + houes + ":" + minutes + ":"  + seconds;
                this.loading = true;
                if(this.formValidate.title !== "" || this.formValidate.uploadUrl !== "" || this.formValidate.content !== "" || this.formValidate.zhaiyao !== ""){
                    try {
                        let res = await post(`/news/update`,{
                            id:this.uid,
                            title:this.formValidate.title,
                            img_url:uploadUrl,
                            content:this.formValidate.content,
                            zhaiyao:this.formValidate.zhaiyao,
                            add_time:gmtDatetime
                        })
                        if(res.code == 200){
                            this.$Message.success("修改成功");
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

            beforeQuillUpload() {
                // 显示loading动画
                this.quillUpdateImg = true
            },

            uploadQuillSuccess(res, file) {
                // res为图片服务器返回的数据
                // 获取富文本组件实例
                let quill = this.$refs.myQuillEditor.quill
                // 如果上传成功
                if (res.code === 200) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.info为服务器返回的图片地址
                    quill.insertEmbed(length, 'image', res.data)
                    // 调整光标到最后
                    quill.setSelection(length + 1)
                } else {
                    this.$message.error('图片插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
            },

            // 富文本图片上传失败
            uploadQuillError() {
                // loading动画消失
                this.quillUpdateImg = false
                this.$message.error('图片插入失败')
            }

        },
        components:{
            quillEditor
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
