<template>
  <div>
    <div
      class="feat-wrapper"
      v-for="(galleryImage, i) in galleryImages"
      :key="`${i}-featimage`"
    >
      <transition appear name="fade">
        <img
          draggable="false"
          class="featured-image"
          loading="lazy"
          :src="galleryImage"
          :alt="`${title} 0${i + 1}`"
        />
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "galleryImages"],
};
</script>