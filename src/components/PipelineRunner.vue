<script setup>
import { onMounted, ref } from 'vue';

import Radio from '@/components/Radio.vue';

const branches = ref(null);
const branch = ref('');
const mode = ref('parallel');
const env = ref('dev');
const url = ref('');
const tag = ref('');

async function fetchTestsBranches() {
  await fetch(
    `https://github.com/dyaroman/wla-e2e/_apis/git/repositories/wla-e2e/refs?filter=heads/&api-version=7.0`,
    {
      headers: {
        // todo use backend to store azure PAT there
        Authorization: `Basic ${btoa(`:${import.meta.env.VITE_AZURE_PAT}`)}`,
      },
    },
  )
    .then((res) => res.json())
    .then((json) => {
      // console.log(json);
      branches.value = json?.value?.map((branchInfo) =>
        branchInfo?.name?.replace('refs/heads/', ''),
      );
    });
}

onMounted(() => {
  fetchTestsBranches();
});
</script>

<template>
  <h2>Run new pipeline:</h2>

  <fieldset>
    <legend>Select branch:</legend>
    <select class="select" v-model="branch">
      <option value="" disabled selected>Select branch</option>
      <option v-for="branch in branches" :value="branch">{{ branch }}</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>Select mode:</legend>
    <div class="radio-group">
      <Radio v-model="mode" value="parallel">Parallel</Radio>
      <Radio v-model="mode" value="steps">Steps</Radio>
    </div>
  </fieldset>

  <fieldset>
    <legend>Select env:</legend>

    <div class="radio-group">
      <Radio v-model="env" value="feature">Feature</Radio>
      <Radio v-model="env" value="dev">Dev</Radio>
      <Radio v-model="env" value="prod">Prod</Radio>
    </div>
  </fieldset>

  <fieldset v-if="env === 'feature'">
    <legend>Feature's URL:</legend>
    <input type="text" class="input" v-model="url" placeholder="url" />
  </fieldset>

  <fieldset>
    <legend>Tag:</legend>
    <input type="text" class="input" v-model="tag" placeholder="tag" />
  </fieldset>
</template>

<style scoped></style>
