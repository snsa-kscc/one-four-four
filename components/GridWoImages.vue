<template>
  <div :class="['onefourfour-grid mt-32', { paginated: hasPagination }]">
    <div v-if="posts.length" class="full-height browse">
      <div
        v-intersect
        v-for="(p, i) in posts"
        :key="i"
        class="bcg-item"
        :style="`transition-delay:${i * 0.1}s`"
      >
        <div
          class="portfolio-title md:flex items-end mx-2 my-4 md:mx-12 md:my-28"
        >
          <nuxt-link class="item-title" :to="p.path">{{ p.title }}</nuxt-link>
        </div>
      </div>
    </div>
    <div v-else class="full-height browse">
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
/* .portfolio-title {
  font-family: "MonumentExtendedUltrabold";
  font-size: clamp(1.4rem, 4vw, 3.5rem);
}
.onefourfour-grid .bcg-item {
  opacity: 0;
  transition: 0.2s opacity ease-out;
}
.onefourfour-grid .intersected.bcg-item {
  opacity: 1;
  transition: 0.2s opacity ease-out;
} */
</style>
