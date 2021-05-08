<template>
  <grid :posts="posts[$route.params.page - 1]"></grid>
</template>

<script>
import _chunk from "lodash/chunk";

export default {
  async asyncData({ $content, params, error, store }) {
    const blogPosts = await $content("portfolio")
      //.sortBy("date", "desc")
      .only(["title", "path", "thumbnail"])
      .fetch()
      .catch((err) => {
        error({ statusCode: 404, message: "Page not found" });
      });
    const chunk = _chunk(blogPosts, 9);
    store.commit("SET_PAGINATION", {
      active: true,
      page: params.page,
      itemsOnPage: chunk[params.page - 1].length,
      totalItems: blogPosts.length,
      totalPages: chunk.length,
    });
    return {
      posts: chunk,
    };
  },
  watchQuery: ["page"],

  transition(to, from) {
    if (!from) return "fade";
    return +to.query.page > +from.query.page ? "slide-left" : "slide-right"; //swapped left and right
  },
  name: "Index",
  data() {
    return {};
  },
  methods: {
    getMore() {},
  },
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
