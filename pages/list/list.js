// pages/list/list.js
const app = getApp()
const { $Toast } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: {
      "bg_color": "linear-gradient(180deg,#06b6fa 0%,#1296ee 100%);",
      "color": "#000",
      "name": "列表"
    },
    list: [],
    payMoneyShow: false,
    getGoods: false,
    remark: "",
    people: "",
    peoplePhone: "",
    address: "",
    goodsRemark: "",
    cost: null,
    goodscost: null,
    sharpCode: [],

    // 续期缴费
    cycle: [],
    cycleData: [],
    cycleId: [],
    chooseIndex: null,
    index: 0,
    paying: false,
    realNameInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let accountInfo = app.globalData.accountInfo;
    let realNameInfo = app.globalData.realNameInfo;
    let getUserInfo, getRealName, getPageInfo;
    let _this = this;
    getPageInfo = () => {
      wx.request({
        url: app.globalData.baseRequestUrl + '/api/orders/getgoodslist',
        header: {
          Token: app.globalData.accountInfo.token,
          UserID: app.globalData.accountInfo.userID,
        },
        success: (res) => {
          let data = res.data.data;
          let codes = [];
          for (let item of data) {
            item.hostDate = item.startTime.split('T')[0]
            item.endShowTime = item.endTime.split('T')[0]
            codes.push(item.sharpCode)
          }
          this.setData({
            list: data,
            sharpCode: codes,
          })
        }
      })
    }
    getUserInfo = () => {
      console.log(this)
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
            app.globalData.realNameInfo = res.data.data
            _this.setData({ realNameInfo: res.data.data })
            resolve(res.data.data)
          }
        })
      })
    }
    if (!accountInfo) {
      getUserInfo().then(accountInfo => {
        getRealName().then(realnameInfo => {
          getPageInfo()
        })
      })
    } else if (!realNameInfo) {
      getRealName().then(realnameInfo => {
        getPageInfo()
      })
    } else {
      getPageInfo()
      console.log(realNameInfo)
      this.setData({
        realNameInfo,
        goodscost: parseFloat(realNameInfo.photoPath),
      })
    }
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/goodsType',
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      success: (res) => {
        this.setData({
          type: res.data.data
        })
      }
    })
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/setMeal',
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      success: (res) => {
        let cycleData = res.data.data;
        let cycle = [];
        let cycleId = [];
        for (let item of cycleData) {
          cycle.push(item.setMealName)
          cycleId.push(item.setMealId)
        }

        // console.log(this.data.cycle)
        this.setData({
          cycle, cycleData,
          cycleId,
        })
        console.log(this.data.cycleId)
        // this.setData({
        //   type: res.data.data
        // })
      }
    })
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
  processPay: function () {
    console.log(1)
    let payinfos = this.data.payinfo;
    wx.requestPayment({
      timeStamp: '' + payinfos.data.timeStamp + '',
      nonceStr: '' + payinfos.data.nonceStr + '',
      package: '' + payinfos.data.package + '',
      signType: '' + payinfos.data.signType + '',
      paySign: '' + payinfos.data.sign + '',
      success: function (res) {
        // success
        console.log("wx.requestPayment返回信息", res);
        wx.redirectTo({
          url: '/pages/list/list',
        })
      },
      fail: function (err) {

      },
      complete: function () {
        console.log("支付完成(成功或失败都为完成)");
      }
    })
  },
  paymoney(e) {
    if (e) {
      this.setData({
        payMoneyShow: true,
        chooseIndex: e.currentTarget.dataset.index
      })
    }
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/getcost',
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      method: "post",
      data: {
        sharpCode: this.data.sharpCode[this.data.chooseIndex],
        setMealID: this.data.cycleId[this.data.index],
      },
      success: (res) => {
        this.setData({
          cost: parseFloat(res.data.data),
        })
      }
    })
  },
  getGoods(e) {
    this.setData({
      getGoods: true,
      chooseIndex: e.currentTarget.dataset.index
    })
  },
  cancel() {
    this.setData({
      payMoneyShow: false,
    })
  },
  goodsCancel() {
    this.setData({
      getGoods: false,
    })
  },
  bindPickerChange: function (e) {
    // console.log(e)
    this.setData({
      index: e.detail.value
    })
    this.paymoney()
  },
  inputRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  inputPeople(e) {
    this.setData({
      "realNameInfo.name": e.detail.value
    })
  },
  inputPeoplePhone(e) {
    this.setData({
      "realNameInfo.phone": e.detail.value
    })
  },
  inputAddress(e) {
    this.setData({
      "realNameInfo.address": e.detail.value
    })
  },
  goodsInputRemark(e) {
    this.setData({
      goodsRemark: e.detail.value
    })
  },
  paygetGoods() {
    let { sharpCode, cycleId, chooseIndex, goodsRemark, goodscost, realNameInfo } = this.data;
    let GoodsType = [];
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/pickOrder',
      method: "POST",
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      data: {
        setMealId: cycleId[chooseIndex],
        sharpCode: sharpCode[chooseIndex],
        cost: goodscost,
        remark: goodsRemark,
        orderDiscription: "quhuo",
        openid: app.globalData.accountInfo.openId,
        spbill_create_ip: "10.10.10.10",
        userName: realNameInfo.name,
        userPhone: realNameInfo.phone,
        userAddress: realNameInfo.address,
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          payinfo: res.data,
        })
        console.log("res", this.data.payinfo)
        this.processPay();
        this.setData({
          payMoneyShow: false,
        })
      }
    })


  },
  renewal() {
    if (this.data.paying) {
      return
    }
    let { cost, cycleId, chooseIndex, remark } = this.data;
    let GoodsType = [];

    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/renewOrder',
      method: "POST",
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      data: {
        setMealId: cycleId[chooseIndex],
        sharpCode: this.data.list[chooseIndex].sharpCode,
        cost: cost,
        remark: remark,
        orderDiscription: "jicun",
        openid: app.globalData.accountInfo.openId,
        spbill_create_ip: "10.10.10.10",
        // userName: app.globalData.realNameInfo.name,
        // userPhone: app.globalData.realNameInfo.Phone,
        // userAddress:"",
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          payinfo: res.data,
          paying: true
        })
        console.log("res", this.data.payinfo)
        this.processPay();
        this.setData({
          payMoneyShow: false,
        })

      }
    })


  }
})
