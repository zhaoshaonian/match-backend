<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo" />-->
          <!----><span v-show="!collapsed" id="logo">后台管理系统</span>
          <!----><img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <navigation>
              <Content class="content-wrapper">
                <keep-alive :include="cacheList">
                    <router-view></router-view>
                </keep-alive>
              </Content>
          </navigation>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<style lang="less">
@import "../../assets/styles/common.less";
</style>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/ico.png'
//import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      //maxLogo,
      isFullscreen: false
    }
  },
  created() {
      // bind event
      this.$navigation.on('forward', (to, from) => {
          //console.log('前进forward to', to, 'from ', from)
      })
      this.$navigation.on('back', (to, from) => {
          //console.log('返回back to', to, 'from ', from)
      })
      this.$navigation.on('replace', (to, from) => {
          //console.log('更换replace to', to, 'from ', from)
      })
      this.$navigation.on('refresh', (to, from) => {
          //console.log('刷新refresh to', to, 'from ', from)
      })
      this.$navigation.on('reset', () => {
          //console.log('重置reset')
      })
      // and use [once, off] methods
      this.$navigation.once('forward', () => {
          //console.log('出现一次(appear once)')
      })
      const off = () => {
          //console.log('will not appear')
      }
      this.$navigation.on('forward', off)
      this.$navigation.off('forward', off)
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return minLogo;
      //return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      let openName = ''
      if (type === 'all') {
        this.turnToPage('home')
        openName = 'home'
      } else if (routeEqual(this.$route, route)) {
        if (type === 'others') {
          openName = route.name
        } else {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
          openName = nextRoute.name
        }
      }
      this.setTagNavList(res)
      this.$refs.sideMenu.updateOpenName(openName)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route.matched)
  }
}
</script>
<style>
  .logo-con{
    text-align: center;
  }
  #logo{
    text-align: center;
    font-size:24px;
    margin:0 auto;
    font-weight: 700;
    color:#fff;
  }
</style>
