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
      <button id="close-button">X Close</button>
      <div v-for="(p, i) in posts" :key="i" class="bcg-item">
        <div
          class="portfolio-title md:flex items-end mx-2 my-4 md:mx-12 md:my-28"
        >
          <nuxt-link class="item-title" :to="p.path">{{ p.title }}</nuxt-link>
          <div class="plane-wrapper">
            <div class="plane" ref="plane">
              <img
                class="featured-image"
                crossorigin=""
                data-sampler="planeTexture"
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
// import {
//   Curtains,
//   Plane,
//   Vec2,
//   Vec3,
//   PingPongPlane,
//   ShaderPass,
//   FXAAPass,
// } from "curtainsjs";
import {
  vs1,
  fs1,
  flowmapVs,
  flowmapFs,
  displacementVs,
  displacementFs,
} from "~/assets/shader.js";
import { gsap, Power3 } from "gsap";
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
      mouse: null,
      lastMouse: null,
      velocity: null,
      updateVelocity: null,
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
      this.curtains = new Curtains({
        container: this.$refs.canvas,
        pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
        // autoRender: false, // use gsap ticker to render our scene
      });

      const planeElements = document.getElementsByClassName("plane");

      this.mouse = new Vec2();
      this.lastMouse = this.mouse.clone();
      this.velocity = new Vec2();

      const params = {
        vertexShader: vs1,
        fragmentShader: fs1,
        widthSegments: 10,
        heightSegments: 10,
        uniforms: {
          time: {
            name: "uTime",
            type: "1f",
            value: 0,
          },
          fullscreenTransition: {
            name: "uTransition",
            type: "1f",
            value: 0,
          },
          mousePosition: {
            name: "uMousePosition",
            type: "2f",
            value: this.mouse,
          },
        },
      };

      /*** GALLERY ***/

      const galleryState = {
        fullscreenThumb: false, // is actually displaying a fullscreen image
        closeButtonEl: document.getElementById("close-button"), // close button element
        openTween: null, // opening tween
        closeTween: null, // closing tween
      };

      // if we should update the velocity or not
      this.updateVelocity = false;

      // creating our PingPongPlane flowmap plane
      // flowmap shaders

      const bbox = this.curtains.getBoundingRect();

      // note the use of half float texture and the custom sampler name used in our fragment shader
      const flowMapParams = {
        sampler: "uFlowMap",
        vertexShader: flowmapVs,
        fragmentShader: flowmapFs,
        watchScroll: false, // position is fixed
        texturesOptions: {
          floatingPoint: "half-float", // use half float texture when possible
        },
        uniforms: {
          mousePosition: {
            name: "uMousePosition",
            type: "2f",
            value: this.mouse,
          },
          // size of the cursor
          fallOff: {
            name: "uFalloff",
            type: "1f",
            value:
              bbox.width > bbox.height
                ? bbox.width / 15000
                : bbox.height / 15000,
          },
          // alpha of the cursor
          alpha: {
            name: "uAlpha",
            type: "1f",
            value: 1,
          },
          // how much the cursor must dissipate over time (ie trail length)
          // closer to 1 = no dissipation
          dissipation: {
            name: "uDissipation",
            type: "1f",
            value: 0.975,
          },
          // our velocity
          velocity: {
            name: "uVelocity",
            type: "2f",
            value: this.velocity,
          },
          // window aspect ratio to draw a circle
          aspect: {
            name: "uAspect",
            type: "1f",
            value: bbox.width / bbox.height,
          },
        },
      };

      // our ping pong plane
      const flowMap = new PingPongPlane(
        this.curtains,
        this.curtains.container,
        flowMapParams
      );

      const passParams = {
        vertexShader: displacementVs,
        fragmentShader: displacementFs,
        depth: false, // explicitly disable depth for the ripple effect to work
      };

      const shaderPass = new ShaderPass(this.curtains, passParams);

      // create a texture that will hold our flowmap
      const flowTexture = shaderPass.createTexture({
        sampler: "uFlowTexture",
        floatingPoint: "half-float",
        fromTexture: flowMap.getTexture(), // set it based on our PingPongPlane flowmap plane's texture
      });

      this.curtains
        // .onScroll(() => {
        //   // update the plane texture offset during scroll
        //   // planes.forEach((plane) => {
        //   // applyPlanesParallax(plane);
        //   // });
        // })
        // .onError(() => {
        //   // we will add a class to the document body to display original images
        //   document.body.classList.add("no-curtains", "planes-loaded");
        // })
        .onContextLost(() => {
          // on context lost, try to restore the context
          this.curtains.restoreContext();
        });

      // use gsap ticker to render our scene
      // gsap ticker handles different monitor refresh rates
      // besides for performance we'll want to have only one request animation frame loop running

      // gsap.ticker.add(this.curtains.render.bind(this.curtains));

      // add our planes and handle them
      for (let i = 0; i < planeElements.length; i++) {
        this.plane = new Plane(this.curtains, planeElements[i], params);

        this.planes.push(this.plane);

        this.handlePlanes(i);
      }

      addEventListener("mousemove", this.onMouseMove);
      addEventListener("touchmove", this.onMouseMove, {
        passive: true,
      });

      /*** POST PROCESSING ***/
      // we'll be adding a flowmap rgb shift effect and fxaapass

      flowMap
        .onRender(() => {
          // update mouse position
          flowMap.uniforms.mousePosition.value = flowMap.mouseToPlaneCoords(
            this.mouse
          );

          // update velocity
          if (!this.updateVelocity) {
            this.velocity.set(
              this.curtains.lerp(this.velocity.x, 0, 0.5),
              this.curtains.lerp(this.velocity.y, 0, 0.5)
            );
          }
          this.updateVelocity = false;

          flowMap.uniforms.velocity.value = new Vec2(
            this.curtains.lerp(this.velocity.x, 0, 0.1),
            this.curtains.lerp(this.velocity.y, 0, 0.1)
          );
        })
        .onAfterResize(() => {
          // update our window aspect ratio uniform
          const boundingRect = flowMap.getBoundingRect();
          flowMap.uniforms.aspect.value =
            boundingRect.width / boundingRect.height;
          flowMap.uniforms.fallOff.value =
            boundingRect.width > boundingRect.height
              ? boundingRect.width / 15000
              : boundingRect.height / 15000;
        });

      // now use the texture of our ping pong plane in the plane that will actually be displayed
      // displacement shaders

      // wait for our first pass and the flowmap to be ready
      flowTexture.onSourceUploaded(() => {
        const fxaaPass = new FXAAPass(this.curtains);
      });
    },

    handlePlanes(index) {
      this.plane = this.planes[index];
      this.plane
        .onReady(() => {
          this.plane.textures[0].setScale(new Vec2(1.5, 1.5));

          // apply parallax on load
          // applyPlanesParallax(plane);

          // once everything is ready, display everything
          // if (index === this.planes.length - 1) {
          //   document.body.classList.add("planes-loaded");
          // }

          // plane.htmlElement.addEventListener("click", (e) => {
          //   onPlaneClick(e, plane);
          // });
        })
        .onAfterResize(() => {
          // if plane is displayed fullscreen, update its scale and translations
          if (this.plane.userData.isFullscreen) {
            const planeBoundingRect = this.plane.getBoundingRect();
            const curtainBoundingRect = this.curtains.getBoundingRect();

            this.plane.setScale(
              new Vec2(
                curtainBoundingRect.width / planeBoundingRect.width,
                curtainBoundingRect.height / planeBoundingRect.height
              )
            );

            this.plane.setRelativeTranslation(
              new Vec3(
                (-1 * planeBoundingRect.left) / this.curtains.pixelRatio,
                (-1 * planeBoundingRect.top) / this.curtains.pixelRatio,
                0
              )
            );
          }

          // apply new parallax values after resize
          // applyPlanesParallax(plane);
        })
        .onRender(() => {
          this.plane.uniforms.time.value++;
        });
    },

    onMouseMove(e) {
      // velocity is our mouse position minus our mouse last position
      this.lastMouse.copy(this.mouse);

      // touch event
      if (e.targetTouches) {
        this.mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
      // mouse event
      else {
        this.mouse.set(e.clientX, e.clientY);
      }

      // divided by a frame duration (roughly)
      this.velocity.set(
        (this.mouse.x - this.lastMouse.x) / 16,
        (this.mouse.y - this.lastMouse.y) / 16
      );

      // we should update the velocity
      this.updateVelocity = true;
    },
  },
  mounted() {
    setTimeout(() => {
      this.initCurtains();
    }, 1000);
  },
  beforeDestroy() {
    this.curtains.dispose();
  },
};
</script>

<style scoped>
button {
  position: fixed;
  top: 6.25em;
  right: 0;
  -webkit-appearance: none;
  border: 0;
  padding: 0.25em 0.5em;
  background: #093c8f;
  font: inherit;
  font-size: 0.85em;
  color: white;
  cursor: pointer;
  z-index: 50;

  display: none;
}
.onefourfour-grid .bcg-item {
  opacity: 1;
  /* transition: 0.2s opacity ease-out; */
}
.onefourfour-grid .intersected.bcg-item {
  opacity: 1;
  /* transition: 0.2s opacity ease-out; */
}
.plane {
  /* pointer-events: none; */
}
.plane img {
  visibility: hidden;
}
</style>
