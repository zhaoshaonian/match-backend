<template>
        <div>
            <Modal v-model="show" title="新增/添加" :mask-closable="false" @on-cancel="cancel(false)" class="form-item" width="800px">
                <Form ref="formValidate" :model="formValidate" :label-width="120">
                    <Row>
                        <Col span="12">
                        <Form-item label="产品名称" prop="productName">
                            <Input v-model.trim="formValidate.productName"></Input>
                        </Form-item>
                        <!--<Form-item label="状态" prop="status">
                            <Select v-model.trim="formValidate.status" style="width:100%" placeholder="请选择">
                                <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Form-item>-->
                        <Form-item label="产品期限(天)" prop="loanTerm">
                            <Input v-model.trim="formValidate.loanTerm"></Input>
                        </Form-item>
                        <Form-item label="产品周期(期)" prop="loanPeriods">
                            <Input v-model.trim="formValidate.loanPeriods"></Input>
                        </Form-item>
                        <Form-item label="最小借款金额" prop="minBorrowMoney">
                            <Input v-model.trim="formValidate.minBorrowMoney"></Input>
                        </Form-item>
                        <Form-item label="最大借款金额" prop="maxBorrowMoney">
                            <Input v-model.trim="formValidate.maxBorrowMoney"></Input>
                        </Form-item>
                        <Form-item label="日利率(‰)" prop="interest">
                            <Input v-model.trim="formValidate.interest"></Input>
                        </Form-item>
                        <Form-item label="费用扣除方式" prop="chargeMethod">
                            <Select v-model.trim="formValidate.chargeMethod" style="width:100%" placeholder="请选择">
                                <Option v-for="(item,index) in chargeList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        </Col>
                        <Col span="11" offset="1">
                        <Form-item label="服务费收取方式" prop="serviceCalculateType">
                            <Select v-model.trim="formValidate.serviceCalculateType" style="width:100%" placeholder="请选择">
                                <Option v-for="(item,index) in serviceList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="服务费" prop="serviceMoney" v-if="formValidate.serviceCalculateType == '1'">
                            <Input v-model.trim="formValidate.serviceMoney"></Input>
                        </Form-item>
                        <Form-item label="服务费费率(%)" prop="serviceRate" v-else>
                            <Input v-model.trim="formValidate.serviceRate"></Input>
                        </Form-item>
                        <Form-item label="宽限期天数" prop="graceDays">
                            <Input v-model.trim="formValidate.graceDays"></Input>
                        </Form-item>
                        <Form-item label="日宽限期费率(%)" prop="graceRate">
                            <Input v-model.trim="formValidate.graceRate"></Input>
                        </Form-item>
                        <Form-item label="逾期费模式" prop="overdueCalculateType">
                            <Select v-model.trim="formValidate.overdueCalculateType" style="width:100%" placeholder="请选择">
                                <Option v-for="(item,index) in overdueList" :value="item.value" :key="index">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="逾期利率(%)" prop="overdueRate">
                            <Input v-model.trim="formValidate.overdueRate"></Input>
                        </Form-item>
                        <Form-item label="逾期费封顶(%)" prop="overdueLimitRate">
                            <Input v-model.trim="formValidate.overdueLimitRate"></Input>
                        </Form-item>
                        </Col>
                    </Row>


                </Form>
                <div slot="footer">
                    <Button type="default" :disabled="loading" @click="cancel(false)">取消</Button>
                    <Button type="primary" :loading="loading" @click="formSubmission('formValidate')">确定</Button>
                </div>
            </Modal>
        </div>
    </template>

    <script>
        import dayjs from 'dayjs'
        import { post , get} from '@/libs/axios-cfg'
        export default {
            name: 'update',
            props: {
                uid:{
                    type:Number,
                    default:{}
                }
            },
            data(){
                return {
                    show: true,
                    loading: false,
                    formValidate:{
                        productName:'',
                        status:'',
                        loanTerm:'',
                        loanPeriods:'',
                        minBorrowMoney:'',
                        maxBorrowMoney:'',
                        interest:'',
                        serviceCalculateType:'',
                        serviceMoney:'',
                        serviceRate:'',
                        chargeMethod:'',
                        graceDays:'',
                        graceRate:'',
                        overdueCalculateType:'',
                        overdueRate:'',
                        overdueLimitRate:''
                    },
                    statusList:[
                        {value: 1,label: '可用'},
                        {value: 2,label: '禁用'},
                    ],
                    serviceList:[
                        {value: 1,label: '固定服务费费率'},
                        {value: 2,label: '日服务费费率'},
                    ],
                    chargeList:[
                        {value: 1,label: '前置'},
                        {value: 2,label: '后置'},
                    ],
                    overdueList:[
                        {value: 0,label: '不收取'},
                        {value: 1,label: '一次性收取'},
                        {value: 2,label: '每日收取'},
                    ],
                }
            },
            created(){
                this.getUserInfo()
            },
            methods:{
                //返回上一页
                goBack(){
                    this.$router.go(-1);
                },
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
                      let res = await post('/pcManage/product/get/{id}',null,{
                          id:this.uid
                      })
                      if(res.data != null) {
                          this.formValidate = res.data
                      }
                  } catch (error) {
                      this.$throw(error)
                  }
                  this.loading = false;
                },
                /**
                 * @description  提交
                 */
                async formSubmission(){
                  this.loading = true;
                  try {
                    let res = await post('/pcManage/product/update',{
                        id : this.uid,
                        chargeMethod: this.formValidate.chargeMethod,
                        graceDays: this.formValidate.graceDays,
                        graceRate: this.formValidate.graceRate,
                        interest: this.formValidate.interest,
                        loanPeriods: this.formValidate.loanPeriods,
                        loanTerm: this.formValidate.loanTerm,
                        maxBorrowMoney: this.formValidate.maxBorrowMoney,
                        minBorrowMoney: this.formValidate.minBorrowMoney,
                        overdueCalculateType: this.formValidate.overdueCalculateType,
                        overdueLimitRate: this.formValidate.overdueLimitRate,
                        overdueRate: this.formValidate.overdueRate,
                        productName: this.formValidate.productName,
                        serviceCalculateType: this.formValidate.serviceCalculateType,
                        serviceMoney: this.formValidate.serviceMoney,
                        serviceRate: this.formValidate.serviceRate
                    })
                    if(res.status == 1){
                      this.$Message.success("修改成功")
                      this.cancel(true)
                    }
                  }catch (error) {
                      this.$throw(error)
                  }
                  this.loading = false;
                },
            },
        }
    </script>

    <style scoped>
        .error-handle{
            padding-bottom:15px;
        }
        .handle_input{
            width:200px;
        }
    </style>
