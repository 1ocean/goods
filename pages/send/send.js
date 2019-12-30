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
      "name": "寄件"
    },
    type: [],
    current: [],
    cycle: [],
    cycleData: [],
    index: 0,
    code: "",
    uploadImgs: [],
    cost: "",
    remark: '',
    deleteModelShow: false,
    deleteUploadImgIndex: null,
    swipperShow: false,
    getRealNameShow: false,
    paying: false,
    moneyAll:[],
    moneyIndex:0,
    costData:[],
    allMoney:0,
    moneyId:[]

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
            if (!res.data.data.phone) {
              return _this.setData({ getRealNameShow: true })
            }
            app.globalData.realNameInfo = res.data.data
            resolve(res.data.data)
          }
        })
      })
    }
        wx.request({
          url: app.globalData.baseRequestUrl + '/api/orders/getinsurance',
          header: {
            Token: accountInfo.token,
            UserID: accountInfo.userID,
          },
          success: (res) => {
           const data =res.data.data;
           console.log(data)
            let moneyAll = [];
            let costData = [];
            let moneyId =[];
            
            for(let item of data){
              let money = `${item.cost}元/保价 ${item.amount}元`
              moneyAll.push(money)
              costData.push(item.cost)
              moneyId.push(item.insuranceId)
            }
            this.setData({
              moneyAll, costData, allMoney: costData[0],moneyId
            })
          }
        })

    if (!accountInfo) {
      getUserInfo().then(accountInfo => {
        getRealName().then(realnameInfo => {
          if (!realnameInfo.phone) {
            return _this.setData({
              getRealNameShow: true
            })
          }
          getPageInfo()
        })
      })
    } else if (!realNameInfo) {
      getRealName().then(realnameInfo => {
        if (!realnameInfo.phone) {
          return _this.setData({
            getRealNameShow: true
          })
        }
        getPageInfo()
      })
    } else {
      if (!realNameInfo.phone){
        return _this.setData({
          getRealNameShow: true
        })
      }
      getPageInfo()
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
  openScan() {
    wx.scanCode({
      success: (obj) => {
        this.setData({ "code": obj.result })
      }
    })
  },
  handleFruitChange({ detail = {} }) {
    const index = this.data.current.indexOf(detail.value);
    index === -1 ? this.data.current.push(detail.value) : this.data.current.splice(index, 1);
    this.setData({
      current: this.data.current
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindMoneyChange: function (e) {
    let allMoney = Number(this.data.cost) + this.data.costData[e.detail.value]
    this.setData({
      moneyIndex: e.detail.value,
      allMoney
    })
  },
  //打开相机或相册
  openCamera() {
    wx.chooseImage({
      count: 6 - this.data.uploadImgs.length,
      success: ({ tempFilePaths, tempFiles }) => {
        let imgs = this.data.uploadImgs;
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
          console.log('图片上传完成');
          this.setData({
            uploadImgs: imgs
          })
        })
      }
    })
  },
  scanCode(e) {
    this.setData({ "code": e.detail.value })
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
    let imgs = this.data.uploadImgs;
    imgs.splice(index, 1);
    this.setData({
      uploadImgs: imgs,
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
  processPay() {
    let payinfos = this.data.payinfo;
    let _this = this

    wx.requestPayment({
      timeStamp: '' + payinfos.data.timeStamp + '',
      nonceStr: '' + payinfos.data.nonceStr + '',
      package: '' + payinfos.data.package + '',
      signType: '' + payinfos.data.signType + '',
      paySign: '' + payinfos.data.sign + '',
      success: function (res) {
        console.log("wx.requestPayment返回信息", res);
        wx.redirectTo({
          url: '/pages/list/list',
        })
      },
      fail: function (err) {
        console.log(err);
        wx.redirectTo({
          url: '/pages/obligation/obligation',
        })
        console.log("支付失败");
      },
      complete: function () {
        _this.setData({
          paying: false
        })
        console.log("支付完成(成功或失败都为完成)");
      }
    })
  },
  sendConfirm() {
    if (this.data.paying) {
      return
    }
    let SharpCode = this.data.code;
    let { cycleData, uploadImgs, cost, remark } = this.data
    if (!SharpCode) {
      return $Toast({
        content: "请输入箱码",
        type: "warning"
      })
    }
    let goodsTypeName = this.data.current;
    let types = this.data.type;
    let GoodsType = [];
    if (goodsTypeName.length == 0) {
      return $Toast({
        content: "请选择物品类型",
        type: "warning"
      })
    }
    for (let item of goodsTypeName) {
      for (let type of types) {
        if (item === type.name) {
          GoodsType.push(type.id)
        }
      }
    }
    GoodsType = GoodsType.join(',');
    let cycleIndex = this.data.index;

    let SetMealId = cycleData[cycleIndex].setMealId

    if (uploadImgs.length == 0) {
      return $Toast({
        content: "请上传物品清单",
        type: "warning"
      })
    }

    let ImagePath = uploadImgs.join(',');
    if (!cost) {
      return $Toast({
        content: "请填写价格",
        type: "warning"
      })
    } else if (String(Number(cost)) == 'NaN') {
      return $Toast({
        content: "请填写正确价格",
        type: "warning"
      })
    }
    this.setData({
      paying: true
    })
    let InsuranceId = this.data.moneyId[this.data.moneyIndex];
    let InsuranceCost = this.data.costData[this.data.moneyIndex];
    wx.request({
      url: app.globalData.baseRequestUrl + '/api/orders/placeOrder',
      method: "POST",
      header: {
        Token: app.globalData.accountInfo.token,
        UserID: app.globalData.accountInfo.userID,
      },
      data: {
        InsuranceId,
        InsuranceCost,
        SharpCode,
        GoodsType,
        SetMealId,
        ImagePath,
        Cost: cost,
        Remark: remark,
        orderDiscription: "jicun",
        openid: app.globalData.accountInfo.openId,
        spbill_create_ip: "10.10.10.10"
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          payinfo: res.data,
        })

        console.log("res", this.data.payinfo)
        // wx.showLoading({
        //   title: '支付中',
        // })
        this.processPay();
      }
    })
  },
  inputPrice(e) {
    let allMoney = Number(e.detail.value)+this.data.costData[this.data.moneyIndex]
    this.setData({ "cost": e.detail.value, allMoney})
  },
  inputRemark(e) {
    this.setData({ "remark": e.detail.value })
  }
})