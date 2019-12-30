//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: true,
  },
  //事件处理函数
  onLoad: function () {
    let getUser = new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: res => {
          resolve(true)
        },
        fail(err) {
          resolve(false)
        }
      })
    })
    getUser.then(res => {
      if (!res) {
        this.setData({
          hasUserInfo: false
        })
      }
    })
  },
  getUserInfo(e) {
    if (!e.detail.userInfo) {
      return
    }
    app.globalData.userInfo = e.detail.userInfo;
    wx.login({
      success: (res) => {
        app.globalData.code = res.code
        if (res.code) {
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
              let accountInfo = data.data.data
              wx.request({
                url: app.globalData.baseRequestUrl + '/api/user/usermes',
                header: {
                  Token: accountInfo.token,
                  UserID: accountInfo.userID,
                },
                success: (res) => {
                  app.globalData.realNameInfo = res.data.data
                }
              })
            }
          })
        }
      }
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumpSend() {
    wx.redirectTo({
      url: "/pages/send/send"
    })
  },
  jumpAppoint() {
    wx.redirectTo({
      url: '/pages/appoint/appoint',
    })
  }
})
