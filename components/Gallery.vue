<template>
  <div class="gallery">
    <div
      class="gallery-item mb-5 md:mb-12"
      v-for="(galleryImage, i) in galleryImages"
      :key="`${i}-image`"
    >
      <transition appear name="fade">
        <img
          draggable="false"
          class="gallery-image"
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