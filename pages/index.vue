<template>
  <grid-liquid :posts="posts[0]" />
</template>

<script>
import _chunk from "lodash/chunk";
import GridLiquid from "../components/GridLiquid.vue";

export default {
  components: { GridLiquid },
  async asyncData({ $content, params, error, store }) {
    const blogPosts = await $content("portfolio")
      .sortBy("date", "desc")
      .only(["title", "path", "thumbnail"])
      .fetch()
      .catch((err) => {
        error({ statusCode: 404, message: "Page not found" });
      });
    const chunk = _chunk(blogPosts, 9);
    if (blogPosts.length > 9) {
      store.commit("SET_PAGINATION", {
        active: true,
        page: 1,
        itemsOnPage: chunk[0].length,
        totalItems: blogPosts.length,
        totalPages: chunk.length,
      });
    } else {
      store.commit("SET_PAGINATION", {
        active: false,
        page: 1,
        itemsOnPage: blogPosts.length,
        totalItems: blogPosts.length,
        totalPages: chunk.length,
      });
    }
    return {
      posts: chunk,
      count: blogPosts.length,
    };
  },
  transition(to, from) {
    if (!from) return "fade";
    return +to.query.page > +from.query.page ? "slide-right" : "slide-left";
  },

  name: "Index",
};
</script>

<style>
.browse a {
  width: 100%;
}
.search:focus {
  outline: none;
}
.footer__heading {
  text-transform: uppercase;
}
nav .r {
  grid-gap: 0;
}
.r.full-height {
  grid-gap: 0;
}
@media only screen and (max-width: 40rem) {
  .xs-collapse {
    visibility: hidden;
    visibility: collapse;
    border: 0 !important;
    border-color: none !important;
    padding: 0 !important;
  }
  .xs-visible {
    visibility: visible;
  }
}
</style>
