<template>
  <div id="video-roll-extension" class="flex justify-center items-center font-red">123</div>
</template>

<script setup lang="ts">
import {
  defineCustomElement,
  ref,
  onMounted,
  provide,
  watch,
  onBeforeUnmount,
} from "vue";
import browser from "webextension-polyfill";
import '../../../lib/global.css';

</script>

<!-- const MyWidget = defineCustomElement({
  name: "App",
  setup() {
    return () => <div id="video-roll-extension" class="flex justify-center items-center font-red">123</div>
  }
}); -->
