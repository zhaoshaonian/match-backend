<template>
        <div>
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="home"></Icon>
                    <span>乒乓球赛程</span>
                </p>
                <Row>
                    <Col span="15">
                        <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加</Button>
                        <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                    </Col>
                </Row>
                <Card>
                    <div>
                        <template>
                            <Table stripe ref="table" align="center"  class="margin-bottom-10" :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data"></Table>
                            <!--分页
                            <Page :total="dataHelp.total" class="tr" @on-change="pageChange" :current.sync="dataHelp.current" :page-size="dataHelp.size" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total></Page>-->
                        </template>
                    </div>
                </Card>
            </Card>
            <!--删除-->
            <Modal v-model="removeModal" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>提示</span>
                </p>
                <div style="text-align:center">
                    <p>此操作为不可逆操作，是否确认删除？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long :loading="setting.loading" @click="removeUser">确认删除</Button>
                </div>
            </Modal>

            <Modal title="查看大图" v-model="visible" class-name="fl-image-modal">
                <img :src="imgUrl" style="width: 100%">
                <div slot="footer">
                    <Button type="info" :loading="setting.loading" @click="visible = false">确认</Button>
                </div>
            </Modal>

            <AddUserInfoSet v-if="addInfoSetModal" @cancel="onModalCancel"/>

            <UpdateUserInfoSet v-if="updateInfoSetModal" :uid="updateInfoSetId" @cancel="onModalCancel"/>
        </div>
    </template>
    <script>
        import dayjs from 'dayjs'
        import { post, get } from '@/libs/axios-cfg'
        import AddUserInfoSet from './components/add.vue'
        import UpdateUserInfoSet from './components/update.vue'
        export default {
            data () {
                return {
                    addInfoSetModal:false,
                    updateInfoSetModal:false,
                    updateInfoSetId:null,
                    removeModal:false,
                    imgUrl: '',
                    visible: false,
                    setting:{
                        loading:true,
                        showBorder:true
                    },
                    columns: [
                        {title: 'ID', key: 'id', align:'center'},
                        {title: '标题', key: 'title', align:'center'},
                        {
                            title: '展示图片',
                            key: 'img_url',
                            render: (h, params) => {
                                return h('img', {
                                    attrs: {
                                        src: params.row.img_url
                                    },
                                    style: {
                                        width: '100px',
                                        cursor: 'pointer',
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleView(e.srcElement.currentSrc)
                                        }
                                    }
                                })
                            },
                            align:'center'
                        },
                        {
                            title: '操作',
                            key: 'action',
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {type: 'primary',size: 'small'},
                                        style: {
                                            marginRight: '5px',
                                        },
                                        on:{
                                            click:()=>{
                                                this.openAddModal(params.row.id);
                                            },
                                        },
                                    }, '修改'),
                                    h('Button', {
                                        props: {type: 'error',size: 'small'},
                                        style: {
                                            marginRight: '5px',
                                        },
                                        on:{
                                            click:()=>{
                                                this.removeObject = {
                                                    obj:params.row,
                                                    index:params.index
                                                }
                                                this.removeModal = true;
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ],
                    data: [],
                    dataFilter:{
                        page:1,
                        pageSize:10
                    },
                    forbiddenObject:null,
                    forbiddenModal:false,
                    removeObject:null,
                    roles:null,
                }
            },
            components:{
                AddUserInfoSet,UpdateUserInfoSet
            },
            created(){
                this.getData();
            },
            mounted(){

            },
            methods:{
                //图片放大
                handleView(url) {
                    this.visible = true;
                    this.imgUrl = url;
                },
                /**
                 * @description 获取信息列表
                 */
                async getData(){
                    this.setting.loading = true;
                    try {
                        let res = await post('/picture/listPing')
                        this.data = res.data;
                    } catch (error) {
                        this.$throw(error)
                    }
                    this.setting.loading = false;
                },
                /**
                 * @description 打开模态窗口
                 * @param uid 用户ID
                 * @param type 打开类型
                 */
                openAddModal(uid,type = "update"){
                    if(uid == null){
                        this.addInfoSetModal = true;
                    }else if(type == "update"){
                        this.updateInfoSetModal = true;
                        this.updateInfoSetId = uid;
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
                            this.addInfoSetModal = false;
                        };break;
                        case 'update':{
                            this.updateInfoSetModal = false;
                        };break;
                    }
                    if(reload) this.getData();
                },
                /**
                 * @description 分页更换事件回调
                 */
                pageChange(p){
                    this.dataFilter.page = p;
                    this.getData();
                },
                /**
                 * @description 分页每页显示数量改变事件回调
                 */
                pageSizeChange(p){
                    this.dataFilter.pageSize = p;
                    this.getData();
                },
                /**
                 * @description 删除
                 */
                async removeUser(){
                    this.removeModal = false;
                    if(this.removeObject==null){
                        this.$Message.warning("删除对象为空，无法继续执行！");
                        return false;
                    }
                    this.setting.loading = true;
                    try {
                        let res = await post('/picture/deletePing',{
                            id: this.removeObject.obj.id
                        })
                        if(res.code == 200){
                            this.$Message.success("删除成功");
                            this.getData()
                        }
                    } catch (error) {
                        this.$throw(error)
                    }
                    this.setting.loading = false;
                },
            }
        }
    </script>
    <style>
        .ivu-card-bordered{
            margin-top:10px;
        }
    </style>
