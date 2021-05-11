<template>
  <div :class="['onefourfour-grid', { paginated: hasPagination }]">
    <div v-if="posts.length" class="r full-height browse">
      <div
        v-intersect
        v-for="(p, i) in posts"
        :key="i"
        class="bcg-item"
        :style="`transition-delay:${0.5 + i * 0.3}s`"
      >
        <div class="item">
          <nuxt-link class="tekst" :to="p.path">{{ p.title }}</nuxt-link>
        </div>
      </div>
    </div>
    <div v-else class="r full-height browse">
      <div class="nema">
        <div v-if="posts.length < 1 && !busy">No Results.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    hasPagination() {
      return this.$store.state.pagination.active || false;
    },
  },
};
</script>

<style>
.onefourfour-grid .bcg-item {
  opacity: 0;
  transition: 0.2s opacity ease-out;
}
.onefourfour-grid .intersected.bcg-item {
  opacity: 1;
  transition: 0.2s opacity ease-out;
}
</style>
