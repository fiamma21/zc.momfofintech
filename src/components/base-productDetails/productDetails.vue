<template>
  <div class="productDetails">
    <ul>
      <li>
        <p><span>产品名称</span>{{ product.productName }}</p>
        <p><span>产品类型</span>{{ productTypeText }}</p>
      </li>
      <li>
        <p><span>融资项目</span>{{ product.projecName }}</p>
        <p><span>项目资产类型</span>{{ assetText_2 }}</p>
      </li>
      <li>
        <p><span>投资方</span>{{ product.customerName }}</p>
        <p><span>募集规模</span>{{ product.recruitmentScale | FilterAmount}}万元</p>
      </li>
      <li>
        <p><span>产品期限</span>{{ productTerm }}{{ productTermUnitText }}</p>
        <p><span>资金结算方式</span>{{ MethodText }}</p>
      </li>
      <li>
        <p><span>期初利率</span>{{ product.financingInitialInterestRate }}%</p>
        <p><span>随期利率</span>{{ product.financingLongTermInterest }}%</p>
      </li>
    </ul>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from 'vuex'
  import until from '../../common/util'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        product: {},
        productType: '',
        assetType: '',
        productTerm:'',
        productTermUnit: '',
        Method: ''
      }
    },
    created () {
      this.getProductDetails()
    },
    filters: {
      //千分位分隔
      FilterAmount: (value) => {
        if(!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)
      }
    },
    computed: {
      ...mapState({
        product_Id(state) {
          if(state.productId === '') {
            this.$store.dispatch('getLocalStorage', 'productId')
          }
          return state.productId
        }
      }),
      assetText_2 () {
        return until.assetTypeText(this.assetType)
      },
      productTypeText () {
        return until.productText(this.productType)
      },
      productTermUnitText () {
        return until.termUnitText(this.productTermUnit)
      },
      MethodText () {
        return until.methodText(this.Method)
      }
    },
    methods: {
      getProductDetails () {
        Axios.post('productInformation/detail.do', {
          pid: this.product_Id
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                let data = res.data
                this.product = data
                this.productType = data.productType
                this.assetType = data.assetType
                this.productTermUnit = data.productTermUnit
                this.Method = data.financingSettlementMethod
                this.productTerm = data.productTerm
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      }
    }
  }
</script>
<style scoped>
  .productDetails li{
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    height: 74px;
    display: flex;
  }
  .productDetails{
    font-size: 18px;
    color: #696969;
    text-align: left;
    padding-bottom: 50px;
  }
  .productDetails li p{
    flex:1
  }
  .productDetails li p:first-child span{
    width: 137px;
    display: inline-block;
  }
  .productDetails li p:last-child span{
    width: 147px;
    margin-right:10px;
    display: inline-block;
  }
  .productDetails li p span::before{
    content: "• ";
    color: #61bfe9;
    padding-right: 4px;
    margin-left: -8px;
  }
</style>
