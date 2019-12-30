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
      "name": "待付款"
    },
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/getnopay',
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      success: (res) => {
        console.log(res)
        let data = res.data.data;
        console.log(data)
        for (let item of data) {
          // item.goodsType = item.goodsType.split(','),
          item.endShowTime = item.endTime.split("T")[0]
        }

        // console.log(data[0].imgs[0])
        // for (let item of data) {
        //   item.hostDate = item.startTime.split('T')[0]
        //   console.log(item.imgs[0])
        // }
        this.setData({
          list: data
        })
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
  showDetail(item) {
    $Toast({
      content: "正在开发中"
    })
  }
})