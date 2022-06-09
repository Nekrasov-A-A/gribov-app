<template>
  <div class="error-wrapper">
    Не удалось установить соединение. Проверьте подключение к интернету и
    перезапустите приложение
  </div>
</template>
<script>
export default {};
</script>
<style lang="sass" scoped>
.error-wrapper
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 1000
  background-color: black
  color: white
  font-size: 24px
  display: flex
  align-items: center
  justify-content: center
</style>
