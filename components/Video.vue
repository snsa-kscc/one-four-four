<template>
  <div class="featured mb-5 md:mb-12" :key="`${title}-video`">
    <transition appear name="fade">
      <video class="featured-image" :src="video" controls />
    </transition>
  </div>
</template>
<script>
export default {
  props: ["title", "video"],
};
</script>
