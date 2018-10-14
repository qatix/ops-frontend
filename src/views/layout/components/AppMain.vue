<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      cachedViews () {
        return this.$store.state.tagsView.cachedViews
      }
    }
  }
</script>
<style>
  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
