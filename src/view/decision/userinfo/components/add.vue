<template>
    <div>
        <Modal v-model="show" :title="$t('userInfo.button.add')" :mask-closable="false" @on-cancel="cancel(false)" class="form-item">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <Form-item :label="$t('userInfo.placeholder.name')" prop="userName">
                            <Input v-model.trim="formValidate.userName"></Input>
                        </Form-item>
                        <Form-item :label="$t('userInfo.placeholder.idcard')" prop="idcard">
                            <Input v-model.trim="formValidate.idcard"></Input>
                        </Form-item>
                        <Form-item :label="$t('userInfo.placeholder.phone')" prop="phone">
                            <Input v-model.trim="formValidate.phone"></Input>
                        </Form-item>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="loading" @click="formSubmission('formValidate')">{{$t('userInfo.button.submit')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    export default {
        name: 'add',
        data: function(){
            return {
                show: true,
                loading: false,
                formValidate:{
                    userName:'',
                    idcard:'',
                    phone:'',
                },
                ruleValidate: {
                    userName: [
                        { required: true, message: this.$t('userInfo.ruleValidate.name'), trigger: 'blur', }
                    ],
                    idcard:[
                        { required: true, message: this.$t('userInfo.ruleValidate.idcard'), trigger: 'blur', }
                    ],
                    phone:[
                        { required: true, message: this.$t('userInfo.ruleValidate.phone'), trigger: 'blur', }
                    ],
                },
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
             * @description
             */
            formSubmission(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submission()
                    }
                })
            },
            async submission(){
              this.loading = true;
              try {
                let res = await post('/risk/api/run',{
                    phone:this.formValidate.phone,
                    idcard:this.formValidate.idcard,
                    name:this.formValidate.userName
                })
                var interval = setTimeout(() => {
                     this.cancel(true)
                     this.$Notice.info({
                         desc: this.$t('userInfo.resultModel.infoContent'),
                     });
                }, 30000);

                if(res){
                    //已经有值了，则清除停止
                    clearTimeout(interval);
                    if(res.code == 'SUCCESS'){
                        if(res.data.count > 0){
                            this.cancel(true)
                            this.$Message.info(this.$t('userInfo.resultModel.warnContent'))
                            /*this.$Notice.info({
                                title: this.$t('userInfo.resultModel.warnContent'),
                            });*/
                        }else{
                            this.$Message.success(this.$t('userInfo.resultModel.message'))
                            this.cancel(true)
                            if(res.data.status == 1){
                                this.$Modal.success({
                                    title: this.$t('userInfo.resultModel.title'),
                                    content: this.$t('userInfo.resultModel.successContent')
                                });
                            }else{
                                this.$Modal.error({
                                    title: this.$t('userInfo.resultModel.title'),
                                    content: this.$t('userInfo.resultModel.errorContent')
                                });
                            }
                        }
                    }else{
                        this.$Message.error(res.msg)
                    }
                }

              }catch (error) {
                  this.$throw(error)
              }
              this.loading = false;
            },
        },
        created(){

        },
    }
</script>

<style scoped>
    .error-handle{
        padding-bottom:15px;
    }
</style>
