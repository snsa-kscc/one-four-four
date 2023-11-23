<template>
  <div :class="['onefourfour-grid mt-32', { paginated: hasPagination }]">
    <div ref="canvas" id="canvas"></div>
    <div
      v-if="siteDescription"
      class="hero mx-4 md:mx-16 py-16 leading-relaxed"
    >
      <p>{{ siteDescription.toUpperCase() }}</p>
    </div>
    <div v-if="posts.length" class="full-height browse">
      <!-- <button id="close-button">X Close</button> -->
      <div v-for="(p, i) in posts" :key="i" class="bcg-item">
        <div
          class="portfolio-title md:flex items-end mx-2 my-4 md:mx-12 md:my-28"
        >
          <nuxt-link class="item-title" :to="p.path">{{ p.title }}</nuxt-link>
          <div class="plane-wrapper">
            <div class="plane" ref="plane">
              <img
                class="featured-image"
                crossorigin="anonymous"
                :src="p.thumbnail"
                :alt="`${p.title}
                  featured image`"
              />
            </div>
          </div>
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
import { vs, fs } from "~/assets/shader.js";
export default {
  props: {
    posts: {
      type: Array,
    },
  },
  data() {
    return {
      curtains: null,
      plane: null,
      planes: [],
      params: {
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
          time: {
            name: "uTime",
            type: "1f",
            value: 0,
          },
        },
      },
    };
  },
  computed: {
    siteDescription() {
      return this.$store.state.info.sitedescription;
    },
    hasPagination() {
      return this.$store.state.pagination.active || false;
    },
  },
  methods: {
    initCurtains() {
      const module = require("curtainsjs");
      this.curtains = new module.Curtains({
        container: this.$refs.canvas,
        pixelRatio: Math.min(1.5, window.devicePixelRatio),
      });

      // for (let i = 0; i < this.$refs.plane.length; i++) {
      //   this.planes.push(
      //     new Plane(this.curtains, this.$refs.plane[i], this.params)
      //   );
      //   this.handlePlanes(i);
      // }
    },

    handlePlanes(index) {
      this.plane = this.planes[index];
      plane.onRender(() => {
        plane.uniforms.time.value++;
      });
    },

    setupPlane() {
      const module = require("curtainsjs");
      this.plane = new module.Plane(
        this.curtains,
        this.$refs.plane[0],
        this.params
      );
      this.plane.onRender(() => {
        this.plane.uniforms.time.value++;
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this.initCurtains();
      this.setupPlane();
    }, 1000);
  },
  beforeDestroy() {
    this.curtains.dispose();
  },
};
</script>

<style>
.onefourfour-grid .bcg-item {
  opacity: 1;
  /* transition: 0.2s opacity ease-out; */
}
.onefourfour-grid .intersected.bcg-item {
  opacity: 1;
  /* transition: 0.2s opacity ease-out; */
}
.plane {
  pointer-events: none;
}
.plane img {
  visibility: hidden;
}
</style>
