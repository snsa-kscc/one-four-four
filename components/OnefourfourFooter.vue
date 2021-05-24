<template>
  <footer class="xs-text-6 md-text-5">
    <div class="r no-gap">
      <div v-if="pagination.active" class="c-12 xs-text-left xs-p2">
        <lazy-pagination :pagination="pagination" />
      </div>
      <div
        class="c-12 xs-text-left xs-p2 xs-border xs-border-right-none xs-border-bottom-none"
      >
        <div class="item xs-text-6">
          <a href="https://144.hr">144</a> creative agency
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    pagination() {
      return this.$store.state.pagination;
    },
    signupAboutSize: function () {
      return {
        "c-25": this.signupBoolean,
        "c-4": !this.signupBoolean,
      };
    },
    connectData() {
      return this.$store.state.connect;
    },
    siteDescription() {
      return this.$store.state.info.sitedescription;
    },
    signupBoolean() {
      return this.$store.state.info.emailsignup;
    },
  },
};
</script>

<style>
.text-input {
  max-width: 100%;
}
.small-txt {
  font-size: 80%;
}
footer .item:hover .footer__heading {
  color: rgba(119, 119, 119, 0.6);
  transition: 0.2s color ease-in-out;
}
.footer__heading {
  max-width: 100%;
  pointer-events: none;
  color: rgba(119, 119, 119, 0.4);
  font-weight: 800;
  font-size: 85%;
  transition: 0.1s color ease-in-out;
}
.pagination__button--disabled {
  pointer-events: none;
}
</style>
