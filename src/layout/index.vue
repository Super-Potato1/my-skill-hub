<script setup lang="ts">
import menuComponent from '@/components/menuComponent.vue'
</script>

<template>
  <div class="layout">
    <menuComponent />
    <div class="content"></div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100%;
}
</style>
