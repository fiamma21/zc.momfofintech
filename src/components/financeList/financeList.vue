<template>
  <div class="financeList" :class="objClassMap[index]">
    <div class="amount"><p></p>{{ list.amount}}<span v-if="list.each">{{ list.each}}</span></div>
    <div class="listText">{{ list.text}}</div>
    <div class="cover" :class="pic[index]"></div>
  </div>
</template>
<script>
  export default {
    props: {
      list: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    data () {
      return {
        objClassMap: ['orangeClass', 'blueClass', 'greyClass'],
        pic: ['orangePic', 'bluePic', 'greyPic']
      }
    }
  }
</script>
<style scoped>
  .financeList {
    transition: all .6s;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
    border-radius: 8px;
    width: 28%;
    height: 140px;
    color: #fff;
    padding-top: 40px;
    text-align: left;
    position: relative;
  }
  .financeList:hover{
    transform: scale(1,1.1);
    cursor: pointer;
    box-shadow: 0 0 5px #ccc;
  }
  .amount {
    font-size: 32px;
    margin-bottom: 29px;
  }

  .amount p {
    background: #ffffff;
    width: 2px;
    height: 26px;
    display: inline-block;
    margin-left: 35px;
    margin-right: 27px;
  }

  .amount span {
    font-size: 22px;
  }

  .listText {
    margin-left: 64px;
    font-size: 22px;
  }

  .orangeClass {
    background-image: linear-gradient(90deg, #f8ce6d 0%, #ea9073 100%);

  }

  .cover {
    width: 70px;
    height: 70px;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .orangePic {
    background: url('../../assets/image/circle.png') no-repeat bottom;
  }

  .bluePic {
    background: url('../../assets/image/circle.png') no-repeat bottom;
  }

  .greyPic {
    background: url('../../assets/image/circle.png') no-repeat bottom;
  }

  .blueClass {
    background-image: linear-gradient(-90deg, #56aae9 0%, #69cde9 100%);
  }

  .greyClass {
    background-image: linear-gradient(-90deg, #798feb 0%, #88b0fc 100%);
  }
</style>
