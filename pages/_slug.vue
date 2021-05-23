<template>
  <main>
    <div
      class="full-height single"
      :style="`min-height: calc(85vh - var(--nav-height));margin-top: var(--nav-height);`"
    >
      <div class="xs-mt2 xs-p2 bcg-item">
        <div class="item xs-block xs-full-height">
          <lazy-featured-image
            v-if="page.thumbnail"
            :title="page.title"
            :thumbnail="page.thumbnail"
          />
          <h1 class="xs-py3 main-title">{{ page.title }}</h1>
          <div class="xs-py3 post-content text-gray">
            <nuxt-content :document="page" />
            <div class="contact__item">
              <div class="form">
                <form
                  name="contact"
                  method="POST"
                  action="/#contact"
                  netlify-honeypot="bot-field"
                  data-netlify="true"
                >
                  <div class="hidden">
                    <input type="text" name="bot-field" placeholder="" />
                    <label><span>Phone</span></label>
                  </div>
                  <div class="form-entry">
                    <input type="text" name="name" placeholder="" required />
                    <label><span>Name</span></label>
                  </div>
                  <div class="form-entry">
                    <input type="email" name="email" placeholder="" required />
                    <label><span>Email</span></label>
                  </div>
                  <div class="form-entry">
                    <textarea name="message" placeholder="" required></textarea>
                    <label><span>Message</span></label>
                  </div>
                  <button class="button button--cta mt-8" type="submit">
                    Send
                  </button>
                </form>
              </div>
              <div class="confirmation"><span>Thanks</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>



<script>
export default {
  async asyncData({ $content, error, params }) {
    const page = await $content("/", params.slug)
      .fetch()
      .catch((err) => {
        error({ statusCode: 404, message: "Page not found" });
      });

    return {
      page,
    };
  },
  head() {
    return {
      title: this.page.title + " | " + this.$store.state.info.sitename,
      meta: [
        // { hid: 'description', name: 'description', content: this.article.description },
        // Open Graph
        { hid: "og:title", property: "og:title", content: this.page.title },
        // { hid: 'og:description', property: 'og:description', content: this.article.description },
        // Twitter Card
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.page.title,
        },
        // { hid: 'twitter:description', name: 'twitter:description', content: this.page.description }
      ],
    };
  },
  mounted() {
    this.$store.commit("SET_CURRENT", this.page);

    let testForm = document.querySelector("form");

    testForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(testForm);
      fetch(testForm.getAttribute("action"), {
        method: "POST",
        headers: {
          Accept: "application/x-www-form-urlencoded;charset=UTF-8",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams(formData).toString(),
      }).then((res) => {
        if (res) {
          document.querySelector(".confirmation").classList.add("show");
          testForm.reset();
          setTimeout(() => {
            document.querySelector(".confirmation").classList.remove("show");
          }, 5000);
        }
      });
    });
  },
  transition(to, from) {
    if (!from) {
      return "slide-left";
    } else {
      return "slide-right";
    }
  },
};
</script>
<style>
.form-entry {
  position: relative;
  height: 3rem;
  overflow: hidden;
}

.form-entry span {
  position: absolute;
  bottom: 5px;
  left: 0px;
  transition: all 0.3s ease;
}

.confirmation {
  background: black;
  padding: 2em;
  position: absolute;
  right: 100px;
  bottom: 0;
  transform: translateY(100%);
  transition: all 1s ease;
  opacity: 0;
  color: white;
}

.show {
  transform: translateY(0%);
  opacity: 1;
}

input,
textarea {
  width: 100%;
  height: 100%;
  font-family: inherit;
  color: black;
  background-color: transparent;
  border: none;
  padding-top: 30px;
  outline: none;
}

label {
  position: absolute;
  bottom: 0px;
  left: 0%;
  width: 100%;
  height: 100%;
  font-size: 0.7em;
  font-weight: 200;
  pointer-events: none;
  border-bottom: 1px solid black;
  color: black;
}

label::after {
  content: "";
  position: absolute;
  left: 0px;
  height: 100%;
  width: 100%;
  border-bottom: 2px solid black;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

input:focus + label span,
input:not(:placeholder-shown) + label span,
textarea:focus + label span,
textarea:not(:placeholder-shown) + label span {
  transform: translateY(-150%);
  font-size: 12px;
}

input:focus + label::after,
input:not(:placeholder-shown) + label::after,
textarea:focus + label::after,
textarea:not(:placeholder-shown) + label::after {
  transform: translateX(0%);
}
</style>