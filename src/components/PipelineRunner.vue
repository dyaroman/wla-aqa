<script setup>
import { onMounted, ref } from 'vue';

const branches = ref(null);
const branch = ref('');
const mode = ref('');
const env = ref('');
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
      <label class="radio">
        <input
          type="radio"
          class="radio__input"
          v-model="mode"
          value="parallel"
          checked
        />
        <span class="radio__custom"></span>
        <span class="radio__label">Parallel</span>
      </label>

      <label class="radio">
        <input type="radio" class="radio__input" v-model="mode" value="steps" />
        <span class="radio__custom"></span>
        <span class="radio__label">Steps</span>
      </label>
    </div>
  </fieldset>

  <fieldset>
    <legend>Select env:</legend>

    <div class="radio-group">
      <label class="radio">
        <input
          type="radio"
          class="radio__input"
          v-model="env"
          value="feature"
        />
        <span class="radio__custom"></span>
        <span class="radio__label">Feature</span>
      </label>

      <label class="radio">
        <input
          type="radio"
          class="radio__input"
          v-model="env"
          value="dev"
          checked
        />
        <span class="radio__custom"></span>
        <span class="radio__label">Dev</span>
      </label>

      <label class="radio">
        <input type="radio" class="radio__input" v-model="env" value="prod" />
        <span class="radio__custom"></span>
        <span class="radio__label">Prod</span>
      </label>
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
