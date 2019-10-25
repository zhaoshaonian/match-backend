<template>
        <div>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="home"></Icon>
                    <span>{{$t('userInfo.title')}}</span>
                </p>
                <div>
                    <template>
                        <Row>
                            <Col class="margin-bottom-10">
                                <Input v-model="idcardModel" :placeholder="$t('userInfo.placeholder.idcard')" style="width:200px; margin-right:10px">
                                </Input>
                                <Input v-model="nameModel" :placeholder="$t('userInfo.placeholder.name')" style="width:200px; margin-right:10px">
                                </Input>
                                <Input v-model="phoneModel" :placeholder="$t('userInfo.placeholder.phone')" style="width:200px; margin-right:10px">
                                </Input>
                                <Select v-model="resultModel" :placeholder="$t('userInfo.placeholder.result')" class="margin-right-10 handle_select">
                                    <i-option v-for="(item,index) in resultList" :key="index" :value="item.value">{{ item.label }}</i-option>
                                </Select>
                                <Button type="primary" icon="ios-search" @click="handleSearch">{{$t('userInfo.button.search')}}</Button>
                                <Button type="warning" @click="handleReset">{{$t('userInfo.button.reset')}}</Button>
                            </Col>
                            <Col span="15">
                                <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;{{$t('userInfo.button.add')}}</Button>
                                <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;{{$t('userInfo.button.refresh')}}</Button>
                            </Col>
                        </Row>
                        <Table stripe ref="table" align="center"  class="margin-top-10 margin-bottom-10"
                             :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
                        <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.current" :page-size="data.size"
                          @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total></Page>
                    </template>
                </div>
            </Card>

            <AddUserInfoSet v-if="addProductSetModal" @cancel="onModalCancel"/>

            <UpdateUserInfoSet v-if="updateProductSetModal" :uid="updateProductSetId" @cancel="onModalCancel"/>
        </div>
    </template>
    <script>
        import dayjs from 'dayjs'
        import { post , get} from '@/libs/axios-cfg'
        import AddUserInfoSet from './components/add.vue'
        import UpdateUserInfoSet from './components/update.vue'
        export default {
            inject:['reload'],
            data () {
                return {
                    idcardModel:"",
                    nameModel:'',
                    phoneModel:'',
                    resultModel:'',
                    addProductSetModal:false,
                    updateProductSetModal:false,
                    updateProductSetId:null,
                    addUserModal:false,
                    updateUserId:null,
                    updateUserModal:false,
                    setting:{
                        loading:true,
                        showBorder:true
                    },
                    resultList:[
                        {value: '1',label: this.$t('userInfo.resultList.pass')},
                        {value: '2',label: this.$t('userInfo.resultList.refuse')},
                    ],
                    columns: [
                        {title: this.$t('userInfo.userInfoTabs.id'), key: 'id', minWidth:80, align:'center'},
                        {title: this.$t('userInfo.userInfoTabs.name'), key: 'userName', minWidth:100, align:'center'},
                        {title: this.$t('userInfo.userInfoTabs.identity'), key: 'idcard', minWidth:100, align:'center'},
                        {title: this.$t('userInfo.userInfoTabs.phones'),key: 'phone', minWidth:100, align:'center'},
                        {title: this.$t('userInfo.userInfoTabs.createDate'), key: 'createDate', minWidth:120, align:'center'},
                        {
                            title: this.$t('userInfo.userInfoTabs.result'),
                            key: 'fraudResult',
                            minWidth:120,
                            render:(h,params)=>{
                                return h('span',
                                    params.row.fraudResult == 1 ? this.$t('userInfo.resultList.pass') :
                                        params.row.fraudResult == 2 ? this.$t('userInfo.resultList.refuse') : '')
                            },
                            align:'center'
                        },
                    ],
                    data: {},
                    dataFilter:{
                        page:1,
                        pageSize:10
                    },
                    roles:null,
                    authority:[]
                }
            },
            components:{
                AddUserInfoSet,UpdateUserInfoSet
            },
            created(){
                this.getData();
            },
            //mounted(){
            //    //使用 $store.dispatch('getUserInfo') 来触发 action 中的 getUserInfo 方法。
            //    this.$store.dispatch("getUserInfo")
            //        .then(res=>{
            //            this.authority = res.access;
            //        });
            //},
            methods:{
                /**
                 * @description 列表
                 */
                async getData(){
                    this.setting.loading = true;
                    try {
                        let res = await get('/api/getlist')
                        //this.data = res.data;
                    } catch (error) {
                        this.$throw(error)
                    }
                    this.setting.loading = false;
                },
                /**
                 * @description 分页更换事件回调
                 */
                pageChange(p){
                    this.dataFilter.page = p;
                    if(this.idcardModel !== "" || this.nameModel !== "" || this.phoneModel !== "" || this.resultModel !== ""){
                        this.handleSearch()
                    }else{
                        this.getData();
                    }
                },
                /**
                 * @description 分页每页显示数量改变事件回调
                 */
                pageSizeChange(p){
                    this.dataFilter.pageSize = p;
                    if(this.idcardModel !== "" || this.nameModel !== "" || this.phoneModel !== "" || this.resultModel !== ""){
                        this.handleSearch()
                    }else{
                        this.getData();
                    }
                },
                /**
                 * @description 搜索
                 */
                 async handleSearch(){
                    this.setting.loading = true;
                    if(this.idcardModel !== "" || this.nameModel !== "" || this.phoneModel !== "" || this.resultModel !== ""){
                        try {
                            let res = await post('/risk/api/list',{
                                fraudResult: this.resultModel,
                                idcard: this.idcardModel,
                                page: this.dataFilter.page,
                                pageSize: this.dataFilter.pageSize,
                                phone: this.phoneModel,
                                userName: this.nameModel
                            })
                            this.data = res.data;
                        } catch (error) {
                            this.$throw(error)
                        }
                    }
                    this.setting.loading = false;
                },
                handleReset(){
                    this.setting.loading = true;
                    this.productName = '';
                    this.reload();
                    this.setting.loading = false;
                },
                /**
                 * @description 导出表格CSV
                 */
                exportData(type){
                    if (type === 1) {
                        this.$refs.table.exportCsv({
                            filename: '用户数据-'+new Date().getTime(),
                            columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                            data: this.data
                        });
                    }
                },
                /**
                 * @description 打开模态窗口
                 * @param uid 用户ID
                 * @param type 打开类型
                 */
                openAddModal(uid,type = "update"){
                    if(uid == null){
                        this.addProductSetModal = true;
                    }else if(type == "update"){
                        this.updateProductSetModal = true;
                        this.updateProductSetId = uid;
                    }
                },
                /**
                 * @description 关闭模态窗口
                 * @param type 窗口类型
                 * @param reload 是否重新加载数据
                 */
                onModalCancel(type,reload = false){
                    switch(type){
                        case 'add':{
                            this.addProductSetModal = false;
                        };break;
                        case 'update':{
                            this.updateProductSetModal = false;
                        };break;
                    }
                    if(reload) this.getData();
                },
            }
        }
    </script>
    <style>
        .handle_select{
            width:200px;
        }
    </style>
