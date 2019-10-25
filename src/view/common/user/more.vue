<template>
        <div>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="home"></Icon>
                    <span>查看更多</span>
                </p>
                <div>
                    <template>
                        <Button type="warning"  @click="goBack" class="handleButton">返回上一页</Button>
                        <Tabs type="card" class="margin-top-10"  v-model="currentTab" @on-click="currentTabChanged" :animated="false">
                            <Tab-pane name="contract" label="借款合同">
                                <Form label-position="left" class="demo-table-expand">
                                    <object :data="this.agreementUrl" type="application/pdf" width="100%" height="750px">
                                        <embed :src="this.agreementUrl" type="application/pdf">
                                            <!--{{agreementUrl}}-->
                                        </embed>
                                    </object>
                                </Form>
                            </Tab-pane>
                            <Tab-pane name="bill" label="用户账单">
                                    <Table
                                    ref="table"
                                    align="center"
                                    class="margin-bottom-10"
                                    :columns="columnsBill"
                                    :loading="setting.loading"
                                    :border="setting.showBorder"
                                    :data="dataBill.records">
                                </Table>
                                <Page
                                    :total="dataBill.total"
                                    class="tr"
                                    @on-change="pageChangeBill"
                                    :current.sync="dataBill.current"
                                    :page-size="dataBill.size"
                                    @on-page-size-change="pageSizeChangeBill"
                                    show-elevator
                                    show-total>
                                </Page>
                            </Tab-pane>
                        </Tabs>
                    </template>
                </div>
            </Card>
        </div>
    </template>
    <script>
        import { post } from '@/libs/axios-cfg'
        export default {
            data () {
                return {
                    currentTab:'',
                    orderId:this.$route.params.id,
                    agreementUrl:this.$route.params.agreementUrl,
                    setting:{
                        loading:true,
                        showBorder:true
                    },
                    columnsBill: [
                        {title: '用户ID', key: 'id', minWidth:90, align:"center"},
                        {
                            title: '用户信息',
                            key: 'auto',
                            render:(h,params)=>{
                                return h('div',[
                                    h('p',[
                                        h("span",'姓名 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.userName),
                                    ]),
                                    h('p',[
                                        h("span",'手机号码 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.phone)
                                    ]),
                                    h('p',[
                                        h("span",'是否老用户 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.isOld == 0 ? '新用户' :
                                            params.row.isOld == 1 ? '老用户' : '其他')
                                    ]),
                                    h('p',[
                                        h("span",'注册渠道 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.channelName)
                                    ]),
                                ])
                            },
                            minWidth:170,
                            align:"left"
                        },
                        {
                            title: '账单信息',
                            key: 'info',
                            render:(h,params)=>{
                                return h('div',[
                                    h('p',[
                                        h("span",'账单号 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.billNum),
                                    ]),
                                    h('p',[
                                        h("span",'订单号 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.orderId)
                                    ]),
                                    h('p',[
                                        h("span",'贷款期限/天 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.billDays)
                                    ]),
                                    h('p',[
                                        h("span",'周期/期 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.billPeriod)
                                    ]),
                                    h('p',[
                                        h("span",'产品名称 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.productName)
                                    ]),
                                ])
                            },
                            minWidth:240,
                            align:"left"
                        },
                        {
                            title: '还款信息',
                            key: 'needPayMoney',
                            render:(h,params)=>{
                                return h('div',[
                                    h('p',[
                                        h("span",'本期应还本金 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.borrowMoney),
                                    ]),
                                    h('p',[
                                        h("span",'本期应还利息 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.interestMoney)
                                    ]),
                                    h('p',[
                                        h("span",'本期应还助贷费 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.serviceMoney)
                                    ]),
                                    h('p',[
                                        h("span",'本期应还违约金 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.penaltyMoney)
                                    ]),
                                ])
                            },
                            minWidth:180,
                            align:"left"
                        },
                        {
                            title: '本期逾期详情',
                            key: 'overdueMoney',
                            render:(h,params)=>{
                                return h('div',[
                                    h('p',[
                                        h("span",'应还逾期费 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.overdueMoney),
                                    ]),
                                    h('p',[
                                        h("span",'是否逾期 : '),
                                        h('tag',{
                                            props : {
                                                color: params.row.isOverdue == 0 ? '#00cc66' :
                                                    params.row.isOverdue == 1 ? '#ff6600' : '#a8aca8'
                                            }
                                        },params.row.isOverdue == 0 ? '未逾期' :
                                            params.row.isOverdue == 1 ? '逾期' : '其他')
                                    ]),
                                ])
                            },
                            minWidth:150,
                            align:"left"
                        },
                        {
                            title: '实际还款信息',
                            key: 'realPayMoney',
                            render:(h,params)=>{
                                return h('div',[
                                    h('p',[
                                        h("span",'实还金额 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.realPayMoney),
                                    ]),
                                    h('p',[
                                        h("span",'还款状态 : '),
                                        h('tag',{
                                            props : {
                                                color: params.row.billStatus == 0 ? '#ff9900' :
                                                    params.row.billStatus == 1 ? '#2db7f5' :
                                                        params.row.billStatus == 2 ? '#2db7f5' :
                                                            params.row.billStatus == 3 ? '#ff6600' :
                                                                params.row.billStatus == 4 ? '#00cc66' : '#a8aca8'
                                            }
                                        },params.row.billStatus == 0 ? '未放款' :
                                            params.row.billStatus == 1 ? '待还款' :
                                                params.row.billStatus == 2 ? '还款中' :
                                                    params.row.billStatus == 3 ? '已逾期' :
                                                        params.row.billStatus == 4 ? '已还款' : '其他')
                                    ]),
                                    h('p',[
                                        h("span",'应还日期 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.needPayTime)
                                    ]),
                                    h('p',[
                                        h("span",'实还日期 : '),
                                        h('span',{
                                            style:{
                                                color:'#3399ff',
                                            }
                                        },params.row.realPayTime)
                                    ]),
                                ])
                            },
                            minWidth:210,
                            align:"left"
                        },

                        {
                            title: '是否续期',
                            key: 'extendType',
                            render:(h,params)=>{
                                return h('tag',
                                    {
                                        props : {
                                            color: params.row.extendType == 0 ? '#00cc66' :
                                                params.row.extendType == 1 ? '#ff9900' :
                                                    params.row.extendType == 2 ? '#ff6600' : '#a8aca8'
                                        }
                                    }, params.row.extendType == 0 ? '未续期' :
                                        params.row.extendType == 1 ? '被续期' :
                                            params.row.extendType == 2 ? '续期' : '其他')
                            },
                            minWidth:100,
                            align:"center"
                        },
                        {title: '创建时间', key: 'createDate', minWidth:100, align:"center"},

                    ],
                    dataBill: {},
                    dataFilterBill:{
                        page:1,
                        pageSize:10,
                    },
                    mark:{
                        tdScore:'',
                    },
                    authObject:null,
                    removeObject:null,
                    roles:null,
                    orderStatus:-3,
                    authority:[]
                }
            },
            components:{

            },
            created(){
                this.getContract();
            },
            mounted(){
                //使用 $store.dispatch('getUserInfo') 来触发 action 中的 getUserInfo 方法。
                this.$store.dispatch("getUserInfo")
                    .then(res=>{
                        //console.log(res)
                        this.authority = res.access;
                        /*if(this.authority.indexOf('aiMgr:authInfo:score') !== -1){
                            this.getScore()
                        }
                        if(this.authority.indexOf('aiMgr:authInfo:contract') !== -1){
                            this.getContact()
                        }
                        if(this.authority.indexOf('aiMgr:authInfo:indentity') !== -1){
                            this.getRecord()
                        }
                        if(this.authority.indexOf('aiMgr:authInfo:bankCard') !== -1){
                            this.getCard()
                        }
                        if(this.authority.indexOf('aiMgr:authInfo:phoneList') !== -1){
                            this.getPhoneList()
                        }
                        if(this.authority.indexOf('aiMgr:authInfo:udInfo') !== -1){
                            this.getUdList()
                        }
                        if(this.authority.indexOf('aiMgr:authInfo:historyRecord') !== -1){
                            this.getHistory()
                        }*/
                    });
            },
            methods:{
                currentTabChanged(name){
                    //console.log(name)
                    if(name == 'contract'){
                        this.getContract()
                    }else if(name == "bill"){
                        this.getBill()
                    }
                },
                //返回上一页
                goBack(){
                    this.$router.go(-1);
                },
                /**
                 * @description 分页更换事件回调-------历史信息
                 */
                 pageChangeBill(p){
                    this.dataFilterBill.page = p;
                    this.getBill();
                },
                /**
                 * @description 分页每页显示数量改变事件回调
                 */
                pageSizeChangeBill(p){
                    this.dataFilterBill.pageSize = p;
                    this.getBill();
                },
                /**
                 * @description 借款合同
                 */
                async getContract(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/loManage/loanBill/listByOrderId/{orderId}`,null,{
                            orderId:this.orderId
                        })
                        //console.log(res)
                    } catch (error) {
                        this.$throw(error)
                    }

                    this.setting.loading = false;
                },
                /**
                 * @description 用户账单
                 */
                 async getBill(){
                   this.setting.loading = true;
                   try {
                       let res = await post(`/loManage/loanBill/billList`,{
                           billNum : "",
                           billStatus : "",
                           channelId : "",
                           createDateEnd : "",
                           createDateStart : "",
                           isOverdue : "",
                           isRenewal : "",
                           needPayTimeEnd : "",
                           needPayTimeStart : "",
                           orderId : this.orderId,
                           orderNum : "",
                           page : this.dataFilterBill.page,
                           pageSize : this.dataFilterBill.pageSize,
                           paramSettingId : "",
                           phone : "",
                           realPayTimeEnd : "",
                           realPayTimeStart : "",
                           userId : "",
                           userName : ""
                       })
                       this.dataBill = res.data;
                   } catch (error) {
                       this.$throw(error)
                   }
                   this.setting.loading = false;
                },

            },
            //监听路由
            watch: {
                $route(to,from){
                    this.orderId = this.$route.params.id;
                    this.agreementUrl = this.$route.params.agreementUrl
                }
            },
        }
    </script>
    <style scoped>
        .ivu-form-item-content img{
            width:60%;
        }
        .ivu-tabs-tabpane{
            box-sizing: border-box;
            padding:0 10px;
        }
        .ivu-form .ivu-form-item-label{
            font-weight: 700;
        }

        .ivu-tabs .ivu-tabs-tabpane{
            overflow: auto;
        }
    </style>
