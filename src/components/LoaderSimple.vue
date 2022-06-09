<template>
  <div class="wrap">
    <div class="triangle"></div>
    <div class="triangle"></div>
    <h3>Выполняется вход</h3>
  </div>
</template>
<script>
export default {};
</script>

<style lang="sass" scoped>
.wrap
  box-sizing: border-box
  height: 100vh
  width: 100vw
  position: absolute
  top: 0
  left: 0
  z-index: 10
  overflow: hidden
  display: flex
  align-items: center
  justify-content: center
  background-color: rgba(44, 36, 112, 0.841)
  > h3
    color: #fff
    margin-top: 140px
    user-select: none
.triangle
  border: 40px solid transparent
  height: 0
  width: 0
  border-bottom-color: #fff
  position: absolute
  animation: rotateA 1.2s linear infinite 0.3s

.triangle:nth-child(2)
  transform: rotate(90deg)
  animation: rotateB 1.2s linear infinite

@keyframes rotateA
  0%, 25%
    transform: rotate(0deg)
  50%, 75%
    transform: rotate(180deg)
  100%
    transform: rotate(360deg)


@keyframes rotateB
  0%, 25%
    transform: rotate(90deg)
  50%,75%
    transform: rotate(270deg)
  100%
    transform: rotate(450deg)
</style>
