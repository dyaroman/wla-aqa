<script setup>
import { onMounted, reactive, ref } from 'vue';

import Radio from '@/components/Radio.vue';
import Loader from '@/components/Loader.vue';
import { normalizeUrl } from '@/misc/helpers.js';

const testsBranches = ref(null);
const testsBranch = ref('');
const formsBranches = ref(null);
const formsBranch = ref('');
const mode = ref('parallel');
const env = ref('dev');
const tag = ref('');
const triggeredPipelineInfo = ref(null);
const status = ref('pending');

const errors = reactive({
  testsBranch: '',
  formsBranch: '',
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

  validateTestsBranch();
  normalizeTestsBranch();

  if (env.value === 'feature') {
    validateFormsBranch();
    normalizeFormsBranch();
  }

  if (errors.testsBranch !== '') return;
  if (errors.formsBranch !== '') return;

  const templateParameters = {
    mode: mode.value,
    env: env.value,
  };

  if (formsBranch.value) {
    let link = formsBranch.value;
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
      branch: testsBranch.value,
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

function normalizeTestsBranch() {
  if (!testsBranch.value.trim() || !testsBranches.value) return;

  const matchingBranch = testsBranches.value.find(
    (branch) => branch?.toLowerCase() === testsBranch.value?.toLowerCase(),
  );

  if (matchingBranch) {
    testsBranch.value = matchingBranch;
  }
}

function validateTestsBranch() {
  if (testsBranch.value.trim() === '') {
    errors.testsBranch = 'Tests branch is required';
  } else if (
    !testsBranches.value?.some(
      (branch) => branch?.toLowerCase() === testsBranch.value?.toLowerCase(),
    )
  ) {
    errors.testsBranch = 'Enter a valid branch';
  } else {
    errors.testsBranch = '';
  }
}

function normalizeFormsBranch() {
  if (!formsBranch.value.trim() || !formsBranches.value) return;

  const matchingBranch = formsBranches.value.find(
    (branch) => branch?.toLowerCase() === formsBranch.value?.toLowerCase(),
  );

  if (matchingBranch) {
    formsBranch.value = matchingBranch;
  }
}

function validateFormsBranch() {
  if (formsBranch.value.trim() === '') {
    errors.formsBranch = 'Forms branch is required';
  } else if (
    !formsBranches.value?.some(
      (branch) => branch?.toLowerCase() === formsBranch.value?.toLowerCase(),
    )
  ) {
    errors.formsBranch = 'Enter a valid branch';
  } else {
    errors.formsBranch = '';
  }
}

onMounted(() => {
  fetchBranches();
});
</script>

<template>
  <form v-if="status === 'pending'" @submit.prevent="triggerPipeline">
    <fieldset>
      <legend>Tests branch:</legend>
      <input
        type="text"
        class="input"
        placeholder="Tests branch"
        list="tests-branches"
        v-model="testsBranch"
        @blur="
          () => {
            validateTestsBranch();
            normalizeTestsBranch();
          }
        "
      />
      <datalist
        id="tests-branches"
        v-if="
          testsBranches?.length > 0 &&
          !testsBranches.find((i) => testsBranch === i)
        "
      >
        <option v-for="branch in testsBranches" :key="branch" :value="branch" />
      </datalist>
      <div class="validation-error" v-if="errors.testsBranch">
        {{ errors.testsBranch }}
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
      <legend>Forms branch:</legend>
      <input
        type="text"
        class="input"
        placeholder="Forms branch"
        list="forms-branches"
        v-model="formsBranch"
        @blur="
          () => {
            validateFormsBranch();
            normalizeFormsBranch();
          }
        "
      />
      <datalist
        id="forms-branches"
        v-if="
          formsBranches?.length > 0 &&
          !formsBranches.find((i) => formsBranch === i)
        "
      >
        <option v-for="branch in formsBranches" :key="branch" :value="branch" />
      </datalist>
      <div class="validation-error" v-if="errors.formsBranch">
        {{ errors.formsBranch }}
      </div>
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
