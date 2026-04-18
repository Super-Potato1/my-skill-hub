<script setup lang="ts">
import { useStore } from '@/stores'
const { userInfo } = useStore()
console.log(userInfo.loginState)
</script>

<template>
  <div class="home">首页</div>
</template>

<style scoped lang="scss"></style>
