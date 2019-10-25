<template>
        <div>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="home"></Icon>
                    <span>用户认证详情</span>
                </p>
                <div>
                    <template>
                        <Button type="warning"  @click="goBack" class="handleButton">返回上一页</Button>
                        <Tabs type="card" class="margin-top-10"  v-model="currentTab" @on-click="currentTabChanged" :animated="false">
                            <Tab-pane label="认证分数" name="score" v-if="authority.indexOf('aiMgr:authInfo:score') !== -1">
                                <i-form label-position="left" class="demo-table-expand">
                                    <Form-item label="认证分数:">
                                    <span>{{mark.tdScore}}</span>
                                    </Form-item>
                                </i-form>
                            </Tab-pane>
                            <Tab-pane label="联系人认证" name="contract" v-if="authority.indexOf('aiMgr:authInfo:contract') !== -1">
                                <i-form label-position="left" class="demo-table-expand">
                                    <Form-item label="姓名:">
                                    <span>{{linkman.userName}}</span>
                                    </Form-item>
                                    <Form-item label="申请时间:">
                                    <span>{{linkman.createDate}}</span>
                                    </Form-item>
                                    <Form-item label="手机号码:">
                                    <span>{{linkman.phone}}</span>
                                    </Form-item>
                                    <Form-item label="联系人一姓名:">
                                    <span>{{linkman.linkPersonNameOne}}</span>
                                    </Form-item>
                                    <Form-item label="联系人一电话:">
                                    <span>{{linkman.linkPersonPhoneOne}}</span>
                                    </Form-item>
                                    <Form-item label="联系人一关系:">
                                    <span>{{linkman.linkPersonRelationOne}}</span>
                                    </Form-item>
                                    <Form-item label="联系人二姓名:">
                                    <span>{{linkman.linkPersonNameTwo}}</span>
                                    </Form-item>
                                    <Form-item label="联系人二电话:">
                                    <span>{{linkman.linkPersonPhoneTwo}}</span>
                                    </Form-item>
                                    <Form-item label="联系人二关系:">
                                    <span>{{linkman.linkPersonRelationTwo}}</span>
                                    </Form-item>
                                </i-form>
                            </Tab-pane>
                            <Tab-pane label="身份认证" name="indentity" v-if="authority.indexOf('aiMgr:authInfo:indentity') !== -1">
                                <i-form label-position="left" class="demo-table-expand">
                                    <Form-item label="姓名:">
                                    <span>{{identity.userName}}</span>
                                    </Form-item>
                                    <Form-item label="手机号码:">
                                    <span>{{identity.phone}}</span>
                                    </Form-item>
                                    <Form-item label="身份证号:">
                                    <span>{{identity.identityNum}}</span>
                                    </Form-item>
                                    <Form-item label="认证状态:">
                                    <span>{{identity.status}}</span>
                                    </Form-item>
                                    <Form-item label="省市区:">
                                    <span>{{linkman.county}}</span>
                                    </Form-item>
                                    <Form-item label="详细地址:">
                                    <span>{{linkman.addressDetails}}</span>
                                    </Form-item>
                                    <Form-item label="身份证正面照:">
                                        <img :src="identity.identityFront" alt="">
                                    </Form-item>
                                    <Form-item label="身份证反面照:">
                                        <img :src="identity.identityBack" alt="">
                                    </Form-item>
                                    <Form-item label="人脸照片:">
                                        <img :src="identity.faceUrl" alt="">
                                    </Form-item>
                                </i-form>
                            </Tab-pane>
                            <Tab-pane label="银行卡认证" name="bankCard" v-if="authority.indexOf('aiMgr:authInfo:bankCard') !== -1">
                                <i-form label-position="left" class="demo-table-expand">
                                    <Form-item label="卡号:">
                                    <span>{{bank.bankCardNo}}</span>
                                    </Form-item>
                                    <Form-item label="姓名:">
                                    <span>{{bank.name}}</span>
                                    </Form-item>
                                    <Form-item label="身份证号:">
                                    <span>{{bank.idCardNo}}</span>
                                    </Form-item>
                                    <Form-item label="手机号码:">
                                    <span>{{bank.bankPhone}}</span>
                                    </Form-item>
                                </i-form>
                            </Tab-pane>
                            <Tab-pane label="手机通讯录" name="phoneList" v-if="authority.indexOf('aiMgr:authInfo:phoneList') !== -1">
                                <Table
                                    ref="table"
                                    align="center"
                                    class="margin-bottom-10"
                                    :columns="columnsPhone"
                                    :loading="setting.loading"
                                    :border="setting.showBorder"
                                    :data="dataPhone.records">
                                </Table>
                                <Page
                                    :total="dataPhone.total"
                                    class="tr"
                                    @on-change="pageChangePhone"
                                    :current.sync="dataPhone.current"
                                    :page-size="dataPhone.size"
                                    @on-page-size-change="pageSizeChangePhone"
                                    show-elevator
                                    show-total>
                                </Page>
                            </Tab-pane>
                            <Tab-pane label="运营商报告" name="OperReport" v-if="authority.indexOf('aiMgr:authInfo:OperReport') !== -1">
                                <i-form label-position="left" class="demo-table-expand">
                                    <Form-item label="运营商报告:">
                                        <Button type="info" @click="getLookUp"><Icon type="ios-search"></Icon>查询</Button>
                                    </Form-item>
                                </i-form>
                            </Tab-pane>
                            <Tab-pane label="有盾信息查询" name="udInfo" v-if="authority.indexOf('aiMgr:authInfo:udInfo') !== -1">
                                <i-form label-position="left" class="demo-table-expand">
                                    <Form-item label="有盾订单号:">
                                    <span>{{udInfo.udInfoId}}</span>
                                    </Form-item>
                                    <Form-item label="有盾评估模型得分:">
                                    <span>{{udInfo.score}}</span>
                                    </Form-item>
                                    <Form-item label="分险等级:">
                                    <span>{{udInfo.riskEvaluation}}</span>
                                    </Form-item>
                                    <Form-item label="用户特征:">
                                    <span>{{udInfo.userFeatureTypeStr}}</span>
                                    </Form-item>
                                    <Form-item label="实际借款平台数:">
                                    <span>{{udInfo.actualLoanPlatformCount}}</span>
                                    </Form-item>
                                    <Form-item label="近1月实际借款平台数:">
                                    <span>{{udInfo.actualLoanPlatformCount1m}}</span>
                                    </Form-item>
                                    <Form-item label="近3月实际借款平台数:">
                                    <span>{{udInfo.actualLoanPlatformCount3m}}</span>
                                    </Form-item>
                                    <Form-item label="近6月实际借款平台数:">
                                    <span>{{udInfo.actualLoanPlatformCount6m}}</span>
                                    </Form-item>
                                    <Form-item label="申请借款平台数:">
                                    <span>{{udInfo.loanPlatformCount}}</span>
                                    </Form-item>
                                    <Form-item label="近1月申请借款平台数:">
                                    <span>{{udInfo.loanPlatformCount1m}}</span>
                                    </Form-item>
                                    <Form-item label="近3月申请借款平台数:">
                                    <span>{{udInfo.loanPlatformCount3m}}</span>
                                    </Form-item>
                                    <Form-item label="近6月申请借款平台数:">
                                    <span>{{udInfo.loanPlatformCount6m}}</span>
                                    </Form-item>
                                    <Form-item label="还款次数:">
                                    <span>{{udInfo.repaymentTimesCount}}</span>
                                    </Form-item>
                                    <Form-item label="还款平台数:">
                                    <span>{{udInfo.repaymentPlatformCount}}</span>
                                    </Form-item>
                                    <Form-item label="近1月还款平台数:">
                                    <span>{{udInfo.repaymentPlatformCount1m}}</span>
                                    </Form-item>
                                    <Form-item label="近3月还款平台数:">
                                    <span>{{udInfo.repaymentPlatformCount3m}}</span>
                                    </Form-item>
                                    <Form-item label="近6月还款平台数:">
                                    <span>{{udInfo.repaymentPlatformCount6m}}</span>
                                    </Form-item>
                                </i-form>
                            </Tab-pane>
                            <Tab-pane label="历史订单" name="historyRecord" v-if="authority.indexOf('aiMgr:authInfo:historyRecord') !== -1">
                                    <Table
                                    ref="table"
                                    align="center"
                                    class="margin-bottom-10"
                                    :columns="columnsHistory"
                                    :loading="setting.loading"
                                    :border="setting.showBorder"
                                    :data="dataHistory.records">
                                </Table>
                                <Page
                                    :total="dataHistory.total"
                                    class="tr"
                                    @on-change="pageChangeHistory"
                                    :current.sync="dataHistory.current"
                                    :page-size="dataHistory.size"
                                    @on-page-size-change="pageSizeChangeHistory"
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
            inject:['reload'],
            data () {
                return {
                    currentTab:'',
                    id:localStorage.getItem("id"),
                    userName:localStorage.getItem("userName"),
                    phone:localStorage.getItem("phone"),
                    setting:{
                        loading:true,
                        showBorder:true
                    },
                    // 手机通讯录
                    columnsPhone: [
                        {title: 'ID', key: 'id', align:"center"},
                        {title: '联系人姓名', key: 'name', align:"center"},
                        {title: '手机号码', key: 'phone', align:"center"},
                    ],
                    dataPhone: {},
                    dataFilterPhone:{
                        page:1,
                        pageSize:20,
                    },
                    // 历史订单
                    columnsHistory: [
                        {title: 'ID', key: 'id', width:90, align:"center"},
                        {
                            title: '姓名',
                            key: 'userName',
                            width:90,
                            align:"center"
                        },
                        {
                            title: '手机号码',
                            key: 'phone',
                            width:120,
                            align:"center"
                        },
                        {
                            title: '是否老用户',
                            key: 'isOld',
                            render:(h,params)=>{
                                return h('tag',
                                    {
                                        props : {
                                            color: params.row.isOld == 0 ? '#5bc0de' :
                                                params.row.isOld == 1 ? '#9b9b9b' : '#a8aca8'
                                        }
                                    }, params.row.isOld == 0 ? '新用户' :
                                        params.row.isOld == 1 ? '老用户' : '其他')
                            },
                            width:120,
                            align:"center"
                        },
                        {title: '注册渠道', key: 'channelName', width:120, align:"center"},
                        {title: '贷款期限/天', key: 'orderDays', width:120, align:"center"},
                        {title: '应还金额', key: 'needPayMoney', width:120, align:"center"},
                        {title: '应还罚息', key: 'overdueMoney', width:120, align:"center"},
                        {title: '实还金额', key: 'realPayMoney', width:120, align:"center"},
                        {
                            title: '订单状态',
                            key: 'orderStatus',
                            render:(h,params)=>{
                                return h('tag',
                                    {
                                        props : {
                                            color: params.row.orderStatus == 0 ? '#ff6600' :
                                                params.row.orderStatus == 11 ? '#3bafda' :
                                                    params.row.orderStatus == 12 ? '#37bc9b' :
                                                        params.row.orderStatus == 13 ? '#ed4014' :
                                                            params.row.orderStatus == 21 ? '#fc8b1c' :
                                                                params.row.orderStatus == 22 ? '#29a5f5' :
                                                                    params.row.orderStatus == 23 ? '#00cc66' :
                                                                        params.row.orderStatus == 31 ? '#2db7f5' :
                                                                            params.row.orderStatus == 32 ? '#10d0dc' :
                                                                                params.row.orderStatus == 33 ? '#e94a48' :
                                                                                    params.row.orderStatus == 34 ? '#19be6b' : '#a8aca8'
                                        }
                                    }, params.row.orderStatus == 0 ? '未申请' :
                                        params.row.orderStatus == 11 ? '待审核' :
                                            params.row.orderStatus == 12 ? '审核中' :
                                                params.row.orderStatus == 13 ? '审核被拒' :
                                                    params.row.orderStatus == 21 ? '待打款' :
                                                        params.row.orderStatus == 22 ? '打款中' :
                                                            params.row.orderStatus == 23 ? '打款失败' :
                                                                params.row.orderStatus == 31 ? '待还款' :
                                                                    params.row.orderStatus == 32 ? '还款中' :
                                                                        params.row.orderStatus == 33 ? '已逾期' :
                                                                            params.row.orderStatus == 34 ? '还款成功' : '其他')
                            },
                            width:150,
                            align:"center"
                        },
                        /*{
                            title: '还款状态',
                            key: 'payStatus',
                            render:(h,params)=>{
                                return h('tag',
                                    {
                                        props : {
                                            color: params.row.payStatus == 0 ? '#ff6600' :
                                                params.row.payStatus == 1 ? '#00cc66' :
                                                    params.row.payStatus == 2 ? '#ff9900' : '#a8aca8'
                                        }
                                    }, params.row.payStatus == 0 ? '未还款' :
                                        params.row.payStatus == 1 ? '正常还款' :
                                            params.row.payStatus == 2 ? '逾期还款' : '其他')
                            },
                            width:150,
                            align:"center",
                            sortable: true
                        },
                        {
                            title: '是否逾期',
                            key: 'isOverdue',
                            render:(h,params)=>{
                                return h('tag',
                                    {
                                        props : {
                                            color: params.row.isOverdue == 0 ? '#00cc66' :
                                                params.row.isOverdue == 1 ? '#ff6600' : '#a8aca8'
                                        }
                                    }, params.row.isOverdue == 0 ? '未逾期' :
                                        params.row.isOverdue == 1 ? '逾期' : '其他')
                            },
                            width:120,
                            align:"center",
                            sortable: true
                        },*/
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
                            width:120,
                            align:"center"
                        },
                        /*{title: '应还日期', key: 'limitPayTime', width:150, align:"center", sortable: true},
                        {title: '实还日期', key: 'realPayTime', width:150, align:"center", sortable: true},
                        {title: '创建时间', key: 'createDate', width:150, align:"center", sortable: true},*/
                        {
                            title: '操作',
                            key: 'action',
                            minWidth: 130,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {type: 'primary' ,size: 'small'},
                                        on:{
                                            click:()=>{
                                                this.checkMore(params.row)
                                            }
                                        }
                                    }, '查看更多'),
                                ]);
                            }
                        }

                    ],
                    dataHistory: {},
                    dataFilterHistory:{
                        page:1,
                        pageSize:10,
                    },
                    mark:{
                        tdScore:'',
                    },
                    linkman:{
                        userName:'',
                        createDate:'',
                        phone:'',
                        linkPersonNameOne:'',
                        linkPersonPhoneOne:'',
                        linkPersonRelationOne:'',
                        linkPersonNameTwo:'',
                        linkPersonPhoneTwo:'',
                        linkPersonRelationTwo:'',
                        county:'',
                        identityNum:'',
                        status:'',
                        addressDetails:'',

                    },
                    identity:{
                        identityNum:'',
                        status:'',
                        addressDetails:'',
                        identityFront:'',
                        identityBack:'',
                        faceUrl:'',

                    },
                    bank:{
                        bankCardNo:'',
                        name:'',
                        idCardNo:'',
                        bankPhone:'',
                    },
                    udInfo:{
                        udInfoId:'',
                        score:'',
                        riskEvaluation:'',
                        userFeatureTypeStr:'',
                        actualLoanPlatformCount:'',
                        actualLoanPlatformCount1m:'',
                        actualLoanPlatformCount3m:'',
                        actualLoanPlatformCount6m:'',
                        loanPlatformCount:'',
                        loanPlatformCount1m:'',
                        loanPlatformCount3m:'',
                        loanPlatformCount6m:'',
                        repaymentTimesCount:'',
                        repaymentPlatformCount:'',
                        repaymentPlatformCount1m:'',
                        repaymentPlatformCount3m:'',
                        repaymentPlatformCount6m:'',
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
                /*this.getScore();
                this.getContact();
                this.getRecord();
                this.getCard();
                this.getPhoneList();
                this.getUdList();
                this.getHistory();*/
                this.getScore()
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
                    console.log(name)
                    if(name == "score"){
                        this.getScore()
                    }else if(name == "contract"){
                        this.getContact()
                    }else if(name == "indentity"){
                        this.getRecord()
                    }else if(name == "bankCard"){
                        this.getCard()
                    }else if(name == "phoneList"){
                        this.getPhoneList()
                    }else if(name == "udInfo"){
                        this.getUdList()
                    }else if(name == "historyRecord"){
                        this.getHistory()
                    }
                },
                checkMore(obj){
                    this.reload()
                    this.setting.loading = true;
                    this.$router.push({name:'more_user',params:{id:obj.id,agreementUrl:obj.agreementUrl}});
                    this.setting.loading = false;
                },
                //返回上一页
                goBack(){
                    this.$router.go(-1);
                },
                /**
                 * @description 分页更换事件回调-------通讯录
                 */
                pageChangePhone(p){
                    this.dataFilterPhone.page = p;
                    this.getPhoneList();
                },
                /**
                 * @description 分页每页显示数量改变事件回调
                 */
                pageSizeChangePhone(p){
                    this.dataFilterPhone.pageSize = p;
                    this.getPhoneList();
                },
                /**
                 * @description 分页更换事件回调-------历史信息
                 */
                 pageChangeHistory(p){
                    this.dataFilterHistory.page = p;
                    this.getPhoneList();
                },
                /**
                 * @description 分页每页显示数量改变事件回调
                 */
                pageSizeChangeHistory(p){
                    this.dataFilterHistory.pageSize = p;
                    this.getPhoneList();
                },
                /**
                 * @description 认证分数
                 */
                async getScore(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/aiMgr/authInfo/score`,{
                            userId:this.id
                        })
                        if(res.data != null){
                            this.mark={
                                tdScore:res.data,
                            }
                        }
                    } catch (error) {
                        this.$throw(error)
                    }

                    this.setting.loading = false;
                },
                /**
                 * @description 联系人认证
                 */
                async getContact(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/aiMgr/authInfo/contract`,{
                            userId:this.id
                        })
                        const contact = res.data;
                        if(contact != null){
                            this.linkman={
                                userName:this.userName,
                                createDate:contact.createDate,
                                phone:this.phone,
                                linkPersonNameOne:contact.linkPersonNameOne,
                                linkPersonPhoneOne:contact.linkPersonPhoneOne,
                                linkPersonRelationOne:contact.linkPersonRelationOne,
                                linkPersonNameTwo:contact.linkPersonNameTwo,
                                linkPersonPhoneTwo:contact.linkPersonPhoneTwo,
                                linkPersonRelationTwo:contact.linkPersonRelationTwo,
                                county:contact.province + contact.city + contact.county,
                                addressDetails:contact.province + contact.city + contact.county + contact.addressDetails
                            }
                        }
                    } catch (error) {
                        this.$throw(error)
                    }//
                    this.setting.loading = false;
                },
                /**
                 * @description 身份认证
                 */
                async getRecord(){
                    this.setting.loading = true;
                    try {
                         let res = await post(`/aiMgr/authInfo/indentity`,{
                            userId:this.id
                        })
                         const record = res.data;
                         if(record != null){
                            this.identity={
                                userName:this.userName,
                                phone:this.phone,
                                identityNum:record.identityNum,
                                status:record.status == 1 ? "已认证" : "未认证",
                                addressDetails:record.addressDetails,
                                identityFront:record.identityFront,
                                identityBack:record.identityBack,
                                faceUrl:record.faceUrl,
                            }
                         }
                    } catch (error) {
                        this.$throw(error)
                    }//
                    this.setting.loading = false;
                },
                /**
                 * @description 银行卡认证
                 */
                async getCard(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/aiMgr/authInfo/bankCard`,{
                            userId:this.id
                        })
                        const card = res.data;
                        if(card != null){
                            this.bank={
                                bankCardNo:card.bankCardNo,
                                name:card.name,
                                idCardNo:card.idCardNo,
                                bankPhone:card.bankPhone,
                            }
                        }
                    } catch (error) {
                        this.$throw(error)
                    }//
                    this.setting.loading = false;
                },
                /**
                 * @description 手机通讯录
                 */
                async getPhoneList(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/aiMgr/authInfo/phoneList`,{
                            asc : true,
                            page : this.dataFilterPhone.page,
                            pageSize : this.dataFilterPhone.pageSize,
                            userId : this.id
                        })
                        if(res.data != null){
                            this.dataPhone = res.data;
                        }
                    } catch (error) {
                        this.$throw(error)
                    }//
                    this.setting.loading = false;
                },
                /**
                 * @description 运营商报告
                 */
                async getLookUp(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/aiMgr/authInfo/OperReport`,{
                            userId:this.id
                        })
                        if(res.data != null){
                          let msg = res.data.message;
                          let href = `https://tenant.51datakey.com/carrier/report_data?data=${msg}`;
                          window.open(href, '_blank', 'toolbar=yes, width=1000,height=600')
                        }else{
                            let href = 'about:blank'
                            window.open(href, '_blank', 'toolbar=yes, width=1000,height=600')
                        }
                    }
                    catch (error) {
                       this.$throw(error)
                    }//
                    this.setting.loading = false;
                },
                /**
                 * @description 有盾信息查询
                 */
                async getUdList(){
                    this.setting.loading = true;
                    try {
                        let res = await post(`/aiMgr/authInfo/udInfo`,{
                            userId:this.id
                        })
                        const ud = res.data;
                        if(ud != null){
                            this.udInfo={
                                udInfoId:ud.udInfoId,
                                score:ud.score,
                                riskEvaluation:ud.riskEvaluation,
                                userFeatureTypeStr:ud.userFeatureTypeStr,
                                actualLoanPlatformCount:ud.actualLoanPlatformCount,
                                actualLoanPlatformCount1m:ud.actualLoanPlatformCount1m,
                                actualLoanPlatformCount3m:ud.actualLoanPlatformCount3m,
                                actualLoanPlatformCount6m:ud.actualLoanPlatformCount6m,
                                loanPlatformCount:ud.loanPlatformCount,
                                loanPlatformCount1m:ud.loanPlatformCount1m,
                                loanPlatformCount3m:ud.loanPlatformCount3m,
                                loanPlatformCount6m:ud.loanPlatformCount6m,
                                repaymentTimesCount:ud.repaymentTimesCount,
                                repaymentPlatformCount:ud.repaymentPlatformCount,
                                repaymentPlatformCount1m:ud.repaymentPlatformCount1m,
                                repaymentPlatformCount3m:ud.repaymentPlatformCount3m,
                                repaymentPlatformCount6m:ud.repaymentPlatformCount6m
                            }
                        }
                    } catch (error) {
                       this.$throw(error)
                    }//
                    this.setting.loading = false;
                },
                /**
                 * @description 历史订单
                 */
                 async getHistory(){
                   this.setting.loading = true;
                   if(this.userName != null){
                       try {
                           let res = await post(`/aiMgr/authInfo/historyRecord`,{
                               asc : true,
                               channelName : "",
                               extendType : "",
                               giveStatus : "",
                               gmtDatetimeEnd : "",
                               gmtDatetimeStart : "",
                               isOverdue : "",
                               limitPayTimeEnd : "",
                               limitPayTimeStart : "",
                               orderStatus : this.orderStatus,
                               page : this.dataFilterHistory.page,
                               pageSize : this.dataFilterHistory.pageSize,
                               payStatus:"",
                               phone : "",
                               realPayTimeEnd : "",
                               realPayTimeStart : "",
                               userId : this.id,
                               userName : ""
                           })
                           this.dataHistory = res.data;
                       } catch (error) {
                           this.$throw(error)
                       }
                   }
                   this.setting.loading = false;
                },

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
            height:1100px;
            overflow: auto;
        }
    </style>
