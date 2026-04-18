<script setup lang="ts"></script>

<template>
  <div class="login-background">
    <div class="login-box"></div>
  </div>
</template>

<style scoped lang="scss">
.login-background {
  width: 100%;
  height: 100%;
  background-color: black;
  background:
    linear-gradient(
      to right,
      #050508 0%,
      rgba(5,5,8) 10%,
      rgba(7,7,9) 20%,
      transparent 28%,
      transparent 72%,
      rgba(7,7,9) 80%,
      rgba(5,5,8) 90%,
      #050508 100%
    ),
    url('../../assets/images/loginBackground.jpg') no-repeat center center / contain;
}
</style>
