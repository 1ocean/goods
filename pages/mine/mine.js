//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    title: {
      "bg_color": "#54B8F6",
      "color": "#000",
      "name": "我的"
    },
    userInfo: {},
    realNameInfo: {},
    getRealNameShow: false
  },
  //事件处理函数
  onLoad: function (options) {
    let accountInfo = app.globalData.accountInfo;
    let realNameInfo = app.globalData.realNameInfo;
    let getUserInfo, getRealName, getPageInfo;
    let _this = this;
    getPageInfo = () => {

    }
    getUserInfo = () => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.baseRequestUrl + "/api/authorize/registerOrLogin",
          method: "POST",
          data: {
            code: app.globalData.code,
            nickName: app.globalData.userInfo.nickName,
            gender: app.globalData.userInfo.gender,
          },
          success: (data) => {
            app.globalData.accountInfo = data.data.data
            accountInfo = data.data.data
            resolve()
          }
        })
      })
    }
    getRealName = () => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.baseRequestUrl + '/api/user/usermes',
          header: {
            Token: accountInfo.token,
            UserID: accountInfo.userID,
          },
          success: (res) => {
            console.log(res.data.data)
            // if (!res.data.data.phone) {
            //   return _this.setData({ getRealNameShow: true })
            // }
            app.globalData.realNameInfo = res.data.data
            this.setData({
              realNameInfo: res.data.data
            })
            resolve(res.data.data)
          }
        })
      })
    }
    if (!accountInfo) {
      getUserInfo().then(accountInfo => {
        getRealName().then(realnameInfo => {
          // if (!realnameInfo) {
          //   return _this.setData({
          //     getRealNameShow: true
          //   })
          // }
          getPageInfo()
        })
      })
    } else if (!realNameInfo) {
      getRealName().then(realnameInfo => {
        // if (!realnameInfo) {
        //   return _this.setData({
        //     getRealNameShow: true
        //   })
        // }
        getPageInfo()
      })
    } else {
      this.setData({
        realNameInfo
      })
      getPageInfo()
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  methods: {
    loginSuccess: function (res) {
      console.log(res.detail);
    },
    loginFail: function (res) {
      console.log(res);
    }
  },
  /* 小程序支付 */
  processPay: function () {
    console.log(1)
    wx.requestPayment({
      timeStamp: "20190703141348070654",
      nonceStr: "F3XAH2Q7V27HN9Y448Q93XQLZ93URD",
      package: "prepay_id=wx0314073473366169dcfbc5481379963800",
      signType: "MD5",
      paySign: "27B01EB8C6F25651F91789BFABBDC257",
      success: function (res) {
        // success
        console.log("wx.requestPayment返回信息", res);
        wx.showModal({
          title: '支付成功',
          content: '您将在“微信支付”官方号中收到支付凭证',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      },
      fail: function (err) {
        console.log(err);

        console.log("支付失败");
      },
      complete: function () {
        console.log("支付完成(成功或失败都为完成)");
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumpRealName() {
    wx.redirectTo({
      url: '/pages/realName/realName',
    })
  },
  jumpBooking() {
    wx.redirectTo({
      url: '/pages/booking/booking',
    })
  },
  jumpObligation() {
    wx.redirectTo({
      url: '/pages/obligation/obligation',
    })
  }
})
