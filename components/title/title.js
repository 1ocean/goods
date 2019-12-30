Component({
  properties: {
    myProperty: {
      type: Object,
      value: {
        "bg_color": "white",
        "color": "#000",
        "flag": 1,
        "name": "我是标题",
        "backUrl":"/pages/send/send"
      }
    },
    commonHeadHeight: {
      type: Object,
      value: {}
    }
  },
  data: {

  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.statusBarHeight": (34 * 2),
          "commonHeadHeight.titleHeight": res.statusBarHeight + 46
        });

      }
    })
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

    },
  },

  methods: {
    commonHead_left_back: function () {
      console.log("back")
      wx.navigateBack();
    },
    commonHead_left_home: function () {
      console.log("home")
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
    back(){
      wx.redirectTo({
        url: this.data.myProperty.backUrl,
      })
    }
  }
})
