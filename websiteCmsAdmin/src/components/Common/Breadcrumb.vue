<template>
  <div class="breadcrumb">
    <!-- 面包屑 -->
    <Breadcrumb>
      <Breadcrumb-item href="/admin/home">首页</Breadcrumb-item>
      <Breadcrumb-item
        v-for="(item, index) in breadcrumb"
        :key="index"
        :href="item.path"
      >{{ item.name }}</Breadcrumb-item>
    </Breadcrumb>
  </div>
</template>

<script>
// Vuex
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["breadcrumb"])
  }
};
</script>

<style lang="less" scoped>
  .breadcrumb {
    padding: 15px;
    background: #f5f5f5;
    z-index: 10;
  }
</style>
