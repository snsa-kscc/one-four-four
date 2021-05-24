<template>
  <main>
    <div
      class="max-w-screen-2xl mx-auto"
      :style="`min-height:calc(85vh - var(--nav-height));margin-top:var(--nav-height)`"
    >
      <h1 class="portfolio-title py-16 md:py-48 text-center">
        {{ post.title }}
      </h1>
      <div class="project md:flex md:items-start space-x-8">
        <div class="images">
          <lazy-gallery
            v-if="post.galleryImages"
            :title="post.title"
            :galleryImages="post.galleryImages"
          />
          <lazy-featured-image
            v-if="post.thumbnail"
            :title="post.title"
            :thumbnail="post.thumbnail"
          />
          <lazy-video
            v-if="post.video"
            :title="post.title"
            :video="post.video"
          />
        </div>
        <div class="description md:sticky md:top-32">
          <div class="xs-mt-5 bold">
            <ul class="list-unstyled xs-flex xs-flex-align-center">
              <li class="xs-inline-block xs-mr1" v-if="post.category">
                <div class="tag fill-gray-darker xs-border">
                  <nuxt-link
                    :to="`/category/${post.category.toLowerCase()}`"
                    class="tag__link text-white"
                    >{{ post.category }}</nuxt-link
                  >
                </div>
              </li>
            </ul>
          </div>
          <div class="xs-py3 post-content text-gray-lighter">
            <nuxt-content :document="post" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>



<script>
export default {
  async asyncData({ $content, params, error }) {
    const post = await $content("portfolio", params.slug)
      .fetch()
      .catch((err) => {
        error({ statusCode: 404, message: "Page not found" });
      });

    return {
      post,
    };
  },
  transition(to, from) {
    if (!from) {
      return "slide-left";
    } else {
      return "slide-right";
    }
  },
  head() {
    return {
      title: this.post.title + " | " + this.$store.state.info.sitename,
      meta: [
        // { hid: 'description', name: 'description', content: this.article.description },
        // Open Graph
        { hid: "og:title", property: "og:title", content: this.post.title },
        // { hid: 'og:description', property: 'og:description', content: this.article.description },
        // Twitter Card
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.post.title,
        },
        // { hid: 'twitter:description', name: 'twitter:description', content: this.page.description }
      ],
    };
  },
  mounted() {
    this.$store.commit("SET_CURRENT", this.post);
  },
};
</script>
