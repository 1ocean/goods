// pages/send/send.js
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
      "name": "预约"
    },
    type: [],
    current: [],
    index: 0,
    code: "",
    goodsImg: [],
    remark: '',
    date: "2019-07-03",
    time: "09:00",
    userName: '',
    phone: '',
    address: '',
    deleteModelShow: false,
    deleteUploadImgIndex: null,
    swipperShow: false,
    realNameInfo: {},
    getRealNameShow: false
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
        url: app.globalData.baseRequestUrl + '/api/orders/goodsType',
        header: {
          Token: app.globalData.accountInfo.token,
          UserID: app.globalData.accountInfo.userID,
        },
        success: (res) => {
          _this.setData({
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
          let cycle = []
          for (let item of cycleData) {
            cycle.push(item.setMealName)
          }
          _this.setData({
            cycle, cycleData
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
            _this.setData({
              realNameInfo: res.data.data
            })
            if (!res.data.data.phone){
              _this.setData({
                getRealNameShow:true
              })
            }
            resolve(res.data.data)
          }
        })
      })
    }
    if (!accountInfo) {
      getUserInfo().then(accountInfo => {
        getRealName().then(realNameInfo => {
          getPageInfo()
        })
      })
    } else if (!realNameInfo) {
      getRealName().then(realNameInfo => {
        getPageInfo()
      })
    } else {
      if(!realNameInfo.phone){
        this.setData({
          getRealNameShow: true
        })
      }
      getPageInfo();
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

  handleFruitChange({ detail = {} }) {
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
  },

  //打开相机或相册
  openCamera() {
    wx.chooseImage({
      count: 6 - this.data.goodsImg.length,
      success: ({ tempFilePaths, tempFiles }) => {
        let imgs = this.data.goodsImg;
        let uploadImg;
        uploadImg = function () {
          return new Promise((resolve, reject) => {
            for (let index in tempFilePaths) {
              wx.uploadFile({
                url: app.globalData.baseRequestUrl + '/api/orders/fileSave',
                filePath: tempFilePaths[index],
                header: {
                  Token: app.globalData.accountInfo.token,
                  UserID: app.globalData.accountInfo.userID,
                },
                name: 'image',
                success(res) {
                  let resJSON = res.data
                  res = JSON.parse(resJSON)
                  // console.log(res.data)
                  let img = app.globalData.baseRequestUrl + res.data
                  imgs.push(img)
                  if (index == tempFilePaths.length - 1) {
                    resolve()
                  }
                },
                fail(err) {
                  console.log(err)
                }
              })
            }
          })
        }
        uploadImg().then(() => {
          this.setData({
            goodsImg: imgs
          })
        })
      }
    })
  },
  showDeleteImg(e) {
    this.setData({
      deleteModelShow: true
    })
  },
  cancelDelete() {
    this.setData({
      deleteModelShow: false
    })
  },
  deleteImg() {
    let index = this.data.deleteUploadImgIndex;
    let imgs = this.data.goodsImg;
    imgs.splice(index, 1);
    this.setData({
      goodsImg: imgs,
      deleteModelShow: false
    })
    this.hideSwipper()
  },
  showDetailImg(e) {
    this.setData({
      deleteUploadImgIndex: e.currentTarget.dataset.index,
      swipperShow: true
    })
  },
  hideSwipper() {
    this.setData({
      swipperShow: false
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  inputName(e) {
    this.setData({ "realNameInfo.name": e.detail.value })
  },
  inputPhone(e) {
    this.setData({ "realNameInfo.phone": e.detail.value })
  },
  inputAddress(e) {
    this.setData({ "realNameInfo.address": e.detail.value })
  },
  inputRemark(e) {
    this.setData({ "remark": e.detail.value })
  },
  sendConfirm() {
    let { current, goodsImg, date, time, realNameInfo, remark, type } = this.data;
    if (current.length == 0) {
      return $Toast({ content: "请选择物品种类", type: "error" })
    } else if (goodsImg.length == 0) {
      return $Toast({ content: "请上传物品清单", type: "error" })
    } else if (!realNameInfo.name) {
      return $Toast({ content: "请填写联系人姓名", type: "error" })
    } else if (!realNameInfo.phone) {
      return $Toast({ content: "请填写联系人号码", type: "error" })
    } else if (!realNameInfo.address) {
      return $Toast({ content: "请填写联系人地址", type: "error" })
    }
    let goodsType = []
    for (let item of current) {
      for (let typeItem of type) {
        if (item == typeItem.name) {
          goodsType.push(typeItem.id)
        }
      }
    }
    goodsType = goodsType.join(',');
    let appointTime = `${date}T${time}:01.545Z`
    goodsImg = goodsImg.join(',');
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/appoint/addappoint',
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      method: "POST",
      data: {
        goodsType, goodsImg, appointTime, remark, ...realNameInfo, userName: realNameInfo.name
      },
      success: (res) => {
        $Toast({ content: "预约成功", type: "success" });
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/booking/booking',
          })
        }, 500)
      }
    })
  },
})