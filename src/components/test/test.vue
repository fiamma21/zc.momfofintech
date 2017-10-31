<!--表单输入组件-->
<!--注意：v-bind:value="value" 第一个value是input本身的prop，第二个value是父组件传递过来的通信值-->
<template>
  <div class="currency-input">
    <label v-if="label">{{ label }}</label>
    <input type="text" ref="input" v-bind:value="value" v-on:input="updateValue($event.target.value)" v-on:blur="formatValue" v-on:focus="selectAll">
  </div>
</template>
<script>
  export default {
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      label: {
        type: String
      },
      value: {
        type: Number
      }
    },
    data () {
      return {}
    },
    mounted(){
      this.formatValue()
    },
    methods: {
//      对输入值进行格式化和位数限制
      updateValue(value) {
        let formattedValue = value.trim().slice(0, value.indexOf('.') + 3)
        if(formattedValue !== value){
          this.$refs.input.value = formattedValue
        }
        this.$emit('input', Number(formattedValue))
      },
//      光标离开，对值进行格式化
      formatValue() {
        this.$refs.input.value = this.value + ','
      },
      selectAll(event) {
        setTimeout(function () {
          event.target.select()
        }, 0)
      }
    }
  }
</script>
<style scoped>
</style>
