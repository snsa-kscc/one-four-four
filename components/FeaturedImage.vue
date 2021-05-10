<template>
  <div class="featured mb-5 md:mb-12" :key="`${title}-image`">
    <transition appear name="fade">
      <img
        draggable="false"
        class="featured-image"
        loading="lazy"
        :src="thumbnail"
        :alt="`${title} featured image`"
      />
    </transition>
  </div>
</template>
<script>
export default {
  props: ["title", "thumbnail"],
};
</script>
