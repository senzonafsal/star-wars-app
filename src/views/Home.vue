<template>
  <div>
      <h1>Star Wars Search</h1>
      <!-- Including the Search component -->
      <Search />
  </div>
</template>

<script lang="ts">
import Search from './Search.vue';

export default {
name: 'HomePage',
components: {
  Search,
},
};
</script>
