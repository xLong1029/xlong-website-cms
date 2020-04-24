<template>
  <div id="loading" class="page-load">
    <Spin>
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>玩命加载中...</div>
    </Spin>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data() {
      return {}
    }
  }
</script>

<style lang="less" scoped>
  .page-load {
    margin:200px 0;
  }
  
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  
  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

