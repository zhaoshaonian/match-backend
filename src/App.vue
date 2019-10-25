<template>
  <div id="app">
      <!--<navigation>
          <router-view v-if="isRouterAlive"></router-view>
      </navigation>-->
      <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide (){
     return {
       reload:this.reload
     }
  },
  data(){
    return {
       isRouterAlive:true
    }
  },
  created() {
      // bind event
      /*this.$navigation.on('forward', (to, from) => {
          console.log('前进forward to', to, 'from ', from)
      })
      this.$navigation.on('back', (to, from) => {
          console.log('返回back to', to, 'from ', from)
      })
      this.$navigation.on('replace', (to, from) => {
          console.log('更换replace to', to, 'from ', from)
      })
      this.$navigation.on('refresh', (to, from) => {
          console.log('刷新refresh to', to, 'from ', from)
      })
      this.$navigation.on('reset', () => {
          console.log('重置reset')
      })
      // and use [once, off] methods
      this.$navigation.once('forward', () => {
          console.log('出现一次(appear once)')
      })
      const off = () => {
          console.log('will not appear')
      }
      this.$navigation.on('forward', off)
      this.$navigation.off('forward', off)*/
  },
  methods:{
    reload (){
       this.isRouterAlive = false
       this.$nextTick(function(){
           this.isRouterAlive = true
       })

    }
  },
  components:{

  },
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  width: 100%;
  height: 100%;;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;;
}
.handle_date .ivu-select-dropdown{
  position:absolute;
  left:0 !important;
}
.handle_d .ivu-select-dropdown{
  position:absolute;
  left:0 !important;
}
.code-row-bg .ivu-card-body{
  padding:0;
}
.handlename{
  margin:0 5px 0 10px;
}

.handle_form{
    margin-top:24px;
}

/*过渡*/

</style>
