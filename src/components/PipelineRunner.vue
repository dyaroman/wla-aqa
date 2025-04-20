<script setup>
import { onMounted, reactive, ref } from 'vue';

import Radio from '@/components/Radio.vue';
import Loader from '@/components/Loader.vue';
import { normalizeUrl } from '@/misc/helpers.js';

const testsBranches = ref(null);
const formsBranches = ref(null);
const branch = ref('');
const mode = ref('parallel');
const env = ref('dev');
const url = ref('');
const tag = ref('');
const triggeredPipelineInfo = ref(null);
const status = ref('pending');

const errors = reactive({
  branch: '',
  url: '',
  triggerPipeline: '',
});

async function fetchBranches() {
  const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/branches`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_KEY}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.error(e.message);
      errors.triggerPipeline = 'Failed to fetch branches: ' + e.message;
      status.value = 'error';
    });

  if (data) {
    formsBranches.value = data['formsBranches'];
    testsBranches.value = data['testsBranches'];
  }
}

async function triggerPipeline() {
  if (status.value !== 'pending') return;

  validateBranch();

  if (env.value === 'feature') {
    validateFeatureUrl();
  }
  if (errors.branch !== '') return;
  if (errors.url !== '') return;

  const templateParameters = {
    mode: mode.value,
    env: env.value,
  };

  if (url.value) {
    let link = url.value;
    if (!link?.includes('example')) {
      link = `https://example.com/${link}`;
    }
    templateParameters.url = normalizeUrl(link);
  }

  if (tag.value) {
    templateParameters.grep = tag.value;
  }

  status.value = 'inProgress';
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/trigger-pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branch: branch.value,
      templateParameters,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        console.error(json.error);
        errors.triggerPipeline = json.error;
        status.value = 'error';
      } else {
        triggeredPipelineInfo.value = json;
        status.value = 'finished';
      }
    })
    .catch((e) => {
      console.error(e);
      errors.triggerPipeline = 'Failed to trigger pipeline: ' + e.message;
      status.value = 'error';
    });
}

function validateBranch() {
  if (branch.value.trim() === '') {
    errors.branch = 'Branch is required';
  } else if (
    !testsBranches.value?.some(
      (b) => b?.toLowerCase() === branch.value?.toLowerCase(),
    )
  ) {
    errors.branch = 'Enter a valid branch';
  } else {
    errors.branch = '';
  }
}

function validateFeatureUrl() {
  if (url.value.trim() === '') {
    errors.url = 'Feature URL is required';
  } else if (
    !formsBranches.value?.some(
      (branch) => branch?.toLowerCase() === url.value?.toLowerCase(),
    )
  ) {
    errors.url = 'Enter a valid feature URL';
  } else {
    errors.url = '';
  }
}

onMounted(() => {
  fetchBranches();
});
</script>

<template>
  <form v-if="status === 'pending'" @submit.prevent="triggerPipeline">
    <fieldset>
      <legend>Branch:</legend>
      <input
        type="text"
        class="input"
        placeholder="Branch"
        list="tests-branches"
        v-model="branch"
        @blur="validateBranch"
      />
      <datalist id="tests-branches">
        <option v-for="branch in testsBranches" :key="branch" :value="branch" />
      </datalist>
      <div class="validation-error" v-if="errors.branch">
        {{ errors.branch }}
      </div>
    </fieldset>

    <fieldset>
      <legend>Mode:</legend>
      <div class="radio-group">
        <Radio name="mode" v-model="mode" value="parallel">parallel</Radio>
        <Radio name="mode" v-model="mode" value="steps">steps</Radio>
      </div>
    </fieldset>

    <fieldset>
      <legend>Env:</legend>

      <div class="radio-group">
        <Radio name="env" v-model="env" value="feature">feature</Radio>
        <Radio name="env" v-model="env" value="dev">dev</Radio>
        <Radio name="env" v-model="env" value="prod">prod</Radio>
      </div>
    </fieldset>

    <fieldset v-if="env === 'feature'">
      <legend>Feature's URL:</legend>
      <input
        type="text"
        class="input"
        placeholder="Feature's URL"
        list="forms-branches"
        v-model="url"
        @blur="validateFeatureUrl"
      />
      <datalist id="forms-branches">
        <option v-for="branch in formsBranches" :key="branch" :value="branch" />
      </datalist>
      <div class="validation-error" v-if="errors.url">{{ errors.url }}</div>
    </fieldset>

    <fieldset>
      <legend>Tag:</legend>
      <input type="text" class="input" v-model="tag" placeholder="Tag" />
    </fieldset>

    <button class="btn" type="submit">Run pipeline</button>
  </form>

  <Loader v-else-if="status === 'inProgress'" />

  <template v-else-if="status === 'finished' && triggeredPipelineInfo">
    <h3>
      Pipeline completed:
      <a :href="triggeredPipelineInfo.link" target="_blank">{{
        triggeredPipelineInfo.name
      }}</a>
    </h3>
    <button class="btn" @click="status = 'pending'">
      Run another pipeline
    </button>
  </template>

  <h3 v-else-if="status === 'error'">
    <template v-if="errors.triggerPipeline"
      >{{ errors.triggerPipeline }}
    </template>
    <template v-else>Failed to trigger pipeline</template>
  </h3>
</template>
