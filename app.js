//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // let _this = this
    // 登录
    wx.login({
      success: (res) => {
        console.log('loginsuccess')
        this.globalData.code = res.code
        if (res.code) {
          wx.getUserInfo({
            success: (response) => {
              console.log('getUserInfosuccess')
              this.globalData.loginInfo = response
              this.globalData.userInfo = response.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              let getUser = new Promise((resolve, reject) => {
                wx.request({
                  url: this.globalData.baseRequestUrl+"/api/authorize/registerOrLogin",
                  method: "POST",
                  data: {
                    code: this.globalData.code,
                    nickName: this.globalData.userInfo.nickName,
                    gender: this.globalData.userInfo.gender,
                  },
                  success: (data) => {
                    this.globalData.accountInfo = data.data.data
                    resolve(data.data.data)
                  }
                })
              })
              getUser.then(accountInfo => {
                wx.request({
                  url: this.globalData.baseRequestUrl + '/api/user/usermes',
                  header: {
                    Token: accountInfo.token,
                    UserID: accountInfo.userID,
                  },
                  success: (res) => {
                    this.globalData.realNameInfo = res.data.data
                  }
                })
              })

            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    loginInfo: null,
    code: null,
    accountInfo: null,
    realNameInfo: null,
    baseRequestUrl: "https://xcx.js-ciie.com"
  }
})