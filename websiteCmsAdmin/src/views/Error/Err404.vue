<template>
  <div class="error-content">
    <img :src="require('@/assets/images/404.png')"/>
    <div>
      <Button type="primary" class="g-mr10" @click="$router.push({ name: 'Home'})">首页</Button>
      <Button type="primary" @click="$router.go(-1)">返回上一页</Button>
    </div>
  </div>
</template>

<script>
	export default {
	}
</script>

<style lang="less" scoped>
.error-content{
  text-align: center;
}
</style>
