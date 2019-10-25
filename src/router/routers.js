import Main from '@/view/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true,
      sidehead: '登录-后台管理系统'
    },
    component: () => import('@/view/login')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          sidehead: '首页-后台管理系统'
        },
        component: () => import('@/view/home/index')
      }
    ]
  },
  //信息管理
  {
    path: '/information',
    name: 'information',
    component: Main,
    meta: {
      title: '信息管理',
      icon:'ios-chatboxes',
    },
    children:[
      { path: 'manager', meta:{icon: 'ios-chatboxes',title:'加油助威', sidehead: '后台管理系统',}, name: 'information_manager', component: () => import('@/view/infomanager/manager') },
    ]
  },

  //实时赛程
  {
      path: '/schedule',
      name: 'schedule',
      component: Main,
      meta: {
          title: '实时赛程',
          icon:'ios-people',
      },
      children:[
          { path: 'all', meta:{icon: 'ios-chatboxes',title:'赛事总览', sidehead: '后台管理系统',}, name: 'schedule_all', component: () => import('@/view/schedule/all') },
          { path: 'football', meta:{icon: 'ios-chatboxes',title:'足球赛程', sidehead: '后台管理系统',}, name: 'schedule_football', component: () => import('@/view/schedule/football') },
          { path: 'basketball', meta:{icon: 'ios-chatboxes',title:'篮球赛程', sidehead: '后台管理系统',}, name: 'schedule_basketball', component: () => import('@/view/schedule/basketball') },
          { path: 'pingpong', meta:{icon: 'ios-chatboxes',title:'乒乓球赛程', sidehead: '后台管理系统',}, name: 'schedule_pingpong', component: () => import('@/view/schedule/pingpong') },
          { path: 'badminton', meta:{icon: 'ios-chatboxes',title:'羽毛球赛程', sidehead: '后台管理系统',}, name: 'schedule_badminton', component: () => import('@/view/schedule/badminton') },
     ]
    },
  //空白页支持刷新--公共页
  {
      path: '/supplier',
      name: 'supplier',
      component: Main,
      meta: {
          title:'加载中',
          hideInMenu: true,
      },
      children:[
          { path: 'back', meta:{icon: 'ios-people', title: '加载中', sidehead: '加载中', hideInMenu: true,}, name: 'supplier_back', component: () => import('@/view/common/supplierAllBack.vue') }
      ]
  },
    //查看更多--公共页
    {
        path: '/more',
        name: 'more',
        component: Main,
        meta: {
            title:'查看更多',
            hideInMenu: true,
        },
        children:[
            { path: 'user', meta:{icon: 'ios-people', title: '查看更多', sidehead: '查看更多-后台管理系统', hideInMenu: true,}, name: 'more_user', component: () => import('@/view/common/user/more.vue') }
        ]
    },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
]
