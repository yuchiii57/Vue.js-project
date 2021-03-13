<!-- 引入template.html,style.scss  -->

<template >
<div id="app">

  <el-header class="header">
    <i class="el-icon-s-operation switch-menu-button" @click="switchMenu"></i>
    <span>後台管理系統</span>
    <el-button  @click="logout" >登出</el-button>
  </el-header>
   <el-container class="content">
      <el-aside class="aside">
        <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
        <el-menu
            default-active="1-4-1"
            :collapse="true"
            router>

            <router-link to="/index/banners" >
            <el-menu-item  index="1">
              Banner管理<i class="el-icon-picture" />
              <span slot="title">Banner管理</span>
            </el-menu-item>
            </router-link>

             <router-link to='/index/promotions'>
             <el-menu-item index="2" >
             優惠活動<i class="el-icon-message-solid" />
              <span slot="title">優惠活動</span>
            </el-menu-item>
            </router-link>
            <router-link to='/index/products'>
            <el-menu-item index="3" >
              商品管理<i class="el-icon-s-goods" />
              <span slot="title">商品管理</span>
            </el-menu-item>
            </router-link>

          <router-link to='/index/articles'>
             <el-menu-item index="5" >
            文章管理 <i class="el-icon-s-claim" />
              <span slot="title">文章管理</span>
            </el-menu-item>
            </router-link>

            <router-link to='/index/users'>
             <el-menu-item index="6" >帳號管理<i class="el-icon-s-custom" />
              <span slot="title">帳號管理</span>
            </el-menu-item>
            </router-link>


          </el-menu>
          <!-- </el-scrollbar> -->
          </el-aside>
      <el-main class="main">
        <router-view></router-view>

      </el-main>
    </el-container>
</div>
</template>
<style lang="scss" src="./style.scss" scoped></style>


<script>
export default {
  name: "app",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$router.push("/login");
    }
  }
};
</script>
