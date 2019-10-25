<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>用户详细信息</span>
            </p>
            <router-link to="/">
                <Button type="primary" icon="ios-search" class="handleButton">返回首页</Button>
            </router-link>
            <Button type="warning"  @click="goBack" class="handleButton">返回上一页</Button>
            <div class="container">
                <i-form :model="form">
                    <Form-item label="ID">
                        <Input v-model="form.id"></Input>
                    </Form-item>
                    <Form-item label="姓名">
                        <Input v-model="form.userName"></Input>
                    </Form-item>
                    <Form-item label="电话">
                        <Input v-model="form.phone" ></Input>
                    </Form-item>
                    <Form-item label="订单ID">
                        <Input v-model="form.orderNumber"></Input>
                    </Form-item>
                    <Form-item label="银行名称">
                        <Input v-model="form.bankName"></Input>
                    </Form-item>
                    <Form-item label="银行卡号">
                        <Input v-model="form.bankCardNum"></Input>
                    </Form-item>
                    <Form-item label="贷款期限">
                        <Input v-model="form.limitDays"></Input>
                    </Form-item>
                    <Form-item label="借款金额">
                        <Input v-model="form.borrowMoney"></Input>
                    </Form-item>
                    <Form-item label="到账金额">
                        <Input v-model="form.realMoney"></Input>
                    </Form-item>
                    <Form-item label="利息">
                        <Input v-model="form.interestMoney"></Input>
                    </Form-item>
                    <Form-item label="平台服务费">
                        <Input v-model="form.placeServeMoney"></Input>
                    </Form-item>
                    <Form-item label="信息认证费">
                        <Input v-model="form.msgAuthMoney"></Input>
                    </Form-item>
                    <Form-item label="分控服务费">
                        <Input v-model="form.riskServeMoney"></Input>
                    </Form-item>
                    <Form-item label="风险准备金">
                        <Input v-model="form.riskPlanMoney"></Input>
                    </Form-item>
                    <Form-item label="综合费用">
                        <Input v-model="form.wateMoney"></Input>
                    </Form-item>
                    <Form-item label="优惠券节省金额">
                        <Input v-model="form.saveMoney"></Input>
                    </Form-item>
                    <Form-item label="应还款金额">
                        <Input v-model="form.needPayMoney"></Input>
                    </Form-item>
                    <Form-item label="申请借款时间">
                        <Input v-model="form.gmtDatetime"></Input>
                    </Form-item>
                    <Form-item label="放款时间">
                        <Input v-model="form.passTime" ></Input>
                    </Form-item>
                    <Form-item label="打款时间">
                        <Input v-model="form.giveTime"></Input>
                    </Form-item>
                    <Form-item label="应还款时间">
                        <Input v-model="form.limitPayTime"></Input>
                    </Form-item>
                </i-form>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'basedetail',
        
        data: function(){
            return {
                id:this.$route.params.id,
                userName:this.$route.params.userName,
                setting:{
                    loading:true,
                    showBorder:true
                },
                form:{
                    id:'',
                    userName:'',
                    phone:'',
                    orderNumber:'',
                    bankName:'',
                    bankCardNum:'',
                    limitDays:'',
                    borrowMoney:'',
                    realMoney:'',
                    interestMoney:'',
                    placeServeMoney:'',
                    msgAuthMoney:'',
                    riskServeMoney:'',
                    riskPlanMoney:'',
                    wateMoney:'',
                    saveMoney:'',
                    needPayMoney:'',
                    gmtDatetime:'',
                    passTime:'',
                    giveTime:'',
                    limitPayTime:'',
                }
            }
        },
        methods:{
            //返回上一页
            goBack(){
                this.$router.go(-1);
            },
            /**
             * @description 认证详情
             */
            async getAuthDetails(){
                this.setting.loading = true;
                try {  //  http://api-dev.fintech-sx.com/api/loanOrder/selectOneDetail?id=${this.id}
                    let res = await get('http://api-dev.fintech-sx.com/api/loanOrder/selectOneDetail',{
                        id : this.id
                    })
                    console.log(res)
                    const score = res.data
                    this.form={
                        id:score.id,
                        userName:score.user.userName,
                        phone:score.user.phone,
                        orderNumber:score.orderNumber,
                        bankName:score.bankName,
                        bankCardNum:score.bankCardNum,
                        limitDays:score.limitDays,
                        borrowMoney:score.borrowMoney,
                        realMoney:score.realMoney,
                        interestMoney:score.interestMoney,
                        placeServeMoney:score.placeServeMoney,
                        msgAuthMoney:score.msgAuthMoney,
                        riskServeMoney:score.riskServeMoney,
                        riskPlanMoney:score.riskPlanMoney,
                        wateMoney:score.wateMoney,
                        saveMoney:score.saveMoney,
                        needPayMoney:score.needPayMoney,
                        gmtDatetime:score.gmtDatetime,
                        passTime:score.passTime,
                        giveTime:score.giveTime,
                        limitPayTime:score.limitPayTime,
                    }
                }catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
        },
        created(){
           this.getAuthDetails()
        },
        watch: {
            '$route'(to,from){
                this.id = this.$route.params.id;
                this.userName = this.$route.params.userName;
                this.getAuthDetails();
            }
        },
    }
</script>

<style scoped>
    .error-handle{
        padding-bottom:15px;
    }
</style>