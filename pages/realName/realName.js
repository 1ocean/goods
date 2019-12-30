// pages/realName/realName.js
const app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agreename:"agree",
    agreeValue:"我已阅读并同意条款内容",
    title: {
      "bg_color": "linear-gradient(180deg,#06b6fa 0%,#1296ee 100%);",
      "color": "#000",
      "name": "实名认证",
      "backUrl": '/pages/mine/mine'
    },
    realNameInfo: {
      name: "",
      phone: "",
      identityCard: "",
      address: "",
    },
    contentshow:false,
    btnText: "我知道了",
    btnDisabled: true,
    agree:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let realNameInfo = app.globalData.realNameInfo;
    if (!realNameInfo) {
      wx.request({
        url: app.globalData.baseRequestUrl + '/api/user/usermes',
        header: {
          Token: app.globalData.accountInfo.token,
          UserID: app.globalData.accountInfo.userID,
        },
        success: (res) => {
          console.log(res.data.data)
          this.setData({
            realNameInfo: res.data.data
          })
          app.globalData.realNameInfo = res.data.data || {}
        }
      })
    } else {
      this.setData({
        realNameInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  inputName(e) {
    this.setData({
      "realNameInfo.name": e.detail.value,
    })
  },
  inputPhone(e) {
    this.setData({
      "realNameInfo.phone": e.detail.value
    })
  },
  inputID(e) {
    this.setData({
      "realNameInfo.identityCard": e.detail.value
    })
  },
  inputAddress(e) {
    this.setData({
      "realNameInfo.address": e.detail.value
    })
  },
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if(e.detail.value[0]=="agree"){
      this.setData({
        agree:true
      })
    }else{
      this.setData({
        agree: false
      })
    }
  },
  showContent(){
    this.setData({
      contentshow:true
    })
    let s = 29;
    let t0 = setInterval(()=>{
      this.setData({
        btnText:"我知道了（"+s+")"
      })
      s--
      if(s==-1){
        this.setData({
          btnText: "我知道了",
          btnDisabled:false
        })
        clearInterval(t0)
      }
    },1000)
  },
  needAgree: function(){
    const that = this;
    setTimeout(function(){
      that.setData({
        contentshow: false
      })
    }
    ,100)
  },
  confirmRealName() {
    let realNameInfo = this.data.realNameInfo;
    let agree = this.data.agree;
    let { name, phone, identityCard, address } = realNameInfo;
    if (!name) {
      return $Toast({
        content: '请输入姓名',
        type: 'warning'
      });
    } else if (!phone) {
      return $Toast({ content: '请输入手机号', type: 'warning' });
    } else if (!identityCard) {
      return $Toast({ content: '请输入身份证号', type: 'warning' });
    } else if (!address) {
      return $Toast({ content: '请输入地址', type: 'warning' });
    } else if (!agree){
      return $Toast({ content: '请阅读并同意条款内容', type: 'warning' });
    } else if (identityCard.length<18){
      return $Toast({ content: '请输入正确的身份证号码', type: 'warning' });
    }
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/user/identity',
      method: "POST",
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      data: {
        ...realNameInfo,

      },
      success: (res) => {
        // console.log(res)
        if (res.data.code == 0) {
          app.globalData.realNameInfo = realNameInfo;
          $Toast({ content: '实名验证成功', type: 'success' });
          wx.redirectTo({
            url: '/pages/mine/mine',
          })
        }
      }
    })
  }
})