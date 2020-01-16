<template>
  <!-- Portfolio Section -->
  <section class="page-section portfolio container col-md-10 col-lg-10" id="portfolio">
    <div class="row">
      <div class="col-md-3 col-lg-3">
        <ChatSideBar />
      </div>
      <div class="col-md-8 col-lg-9">
        <ChatWindow />
      </div>
    </div>
  </section>
</template>

<script>
import ChatSideBar from "@/components/ChatSideBar.vue";
import ChatWindow from "@/components/ChatWindow.vue";

export default {
  name: "MainChat",
  components: {
    ChatSideBar,
    ChatWindow
  }
};
</script>
