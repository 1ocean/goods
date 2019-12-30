// components/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbarIndex:{
      type:Number,
      value:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbar:[
      {
        text:"寄件",
        img:'/assets/imgs/png/send.png',
        choosedImg:'/assets/imgs/png/send_blue.png',
        url:"/pages/index/index"
      },
      {
        text: "查件",
        img: '/assets/imgs/png/list.png',
        choosedImg: '/assets/imgs/png/list_blue.png',
        url: "/pages/list/list"
      },
      {
        text: "我的",
        img: '/assets/imgs/png/mine.png',
        choosedImg: '/assets/imgs/png/mine_blue.png',
        url: "/pages/mine/mine"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigator(e){
      let index = e.currentTarget.dataset.index;
      let tabbarIndex = this.data.tabbarIndex;
      if (index == tabbarIndex){
        return
      }
      wx.redirectTo({
        url:this.data.tabbar[index].url
      })
    }
  }
})
