<template>
  <Layout>
    <template #nav-bar-content-after>
      <AskAI />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import AskAI from './components/AskAI.vue'

const { Layout } = DefaultTheme
</script>
