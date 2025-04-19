<script setup>
import { onMounted, reactive, ref } from 'vue';

import Radio from '@/components/Radio.vue';
import { normalizeUrl } from '@/misc/helpers.js';

const branches = ref(null);
const formsBranches = ref(null);
const branch = ref('');
const mode = ref('parallel');
const env = ref('dev');
const url = ref('');
const tag = ref('');

const errors = reactive({
  branch: '',
  url: '',
});

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
      branches.value = json?.value?.map((branchInfo) =>
        branchInfo?.name?.replace('refs/heads/', ''),
      );
    });
}

async function fetchFormsBranches() {
  await fetch(
    `https://github.com/dyaroman/LM JS Forms/_apis/git/repositories/wla-e2e/refs?filter=heads/&api-version=7.0`,
    {
      headers: {
        // todo use backend to store azure PAT there
        Authorization: `Basic ${btoa(`:${import.meta.env.VITE_AZURE_PAT}`)}`,
      },
    },
  )
    .then((res) => res.json())
    .then((json) => {
      formsBranches.value = json?.value
        ?.filter((branchInfo) => branchInfo?.name?.includes('feature/'))
        ?.map((branchInfo) =>
          branchInfo?.name?.replace('refs/heads/feature/', ''),
        );
    });
}

async function triggerPipeline() {
  validateBranch();
  if (errors.branch !== '') return;

  if (env.value === 'feature') {
    validateFeatureUrl();
    if (errors.url !== '') return;
  }

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

  console.log(
    JSON.stringify(
      {
        resources: {
          repositories: {
            self: {
              refName: `refs/heads/${branch.value}`,
            },
          },
        },
        templateParameters,
      },
      null,
      2,
    ),
  );

  // await fetch(
  //   `https://github.com/dyaroman/wla-e2e/_apis/pipelines/1367/runs?api-version=7.0`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Basic ${btoa(`:${import.meta.env.VITE_AZURE_PAT}`)}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       resources: {
  //         repositories: {
  //           self: {
  //             refName: `refs/heads/${branch.value}`,
  //           },
  //         },
  //       },
  //       templateParameters,
  //     }),
  //   },
  // )
  //   .then((res) => res.json())
  //   .then((json) => {
  //     console.log(json);
  //   });

  // {
  //   "_links": {
  //   "self": {
  //     "href": "https://github.com/dyaroman/REMOVED/_apis/pipelines/1367/runs/269185"
  //   },
  //   "web": {
  //     "href": "https://github.com/dyaroman/REMOVED/_build/results?buildId=269185"
  //   },
  //   "pipeline.web": {
  //     "href": "https://github.com/dyaroman/REMOVED/_build/definition?definitionId=1367"
  //   },
  //   "pipeline": {
  //     "href": "https://github.com/dyaroman/REMOVED/_apis/pipelines/1367?revision=2"
  //   }
  // },
  //   "templateParameters": {
  //   "mode": "parallel",
  //     "env": "dev",
  //     "url": "https://example.com/42_some_feature_here/",
  //     "grep": "tag"
  // },
  //   "pipeline": {
  //   "url": "https://github.com/dyaroman/REMOVED/_apis/pipelines/1367?revision=2",
  //     "id": 1367,
  //     "revision": 2,
  //     "name": "wla-e2e",
  //     "folder": "\\"
  // },
  //   "state": "inProgress",
  //   "createdDate": "2025-04-16T11:03:13.6649444Z",
  //   "url": "https://github.com/dyaroman/REMOVED/_apis/pipelines/1367/runs/269185",
  //   "resources": {
  //   "repositories": {
  //     "self": {
  //       "repository": {
  //         "id": "99d396c4-fd8f-49cf-bd97-9e94074062f6",
  //           "type": "azureReposGit"
  //       },
  //       "refName": "refs/heads/feature/111887_loan_purpose_buttons",
  //         "version": "699eaf2b979f15ad2ce0822b5a7b7a3869a55d1f"
  //     }
  //   }
  // },
  //   "id": 269185,
  //   "name": "20250416.1"
  // }
}

function validateBranch() {
  if (branch.value.trim() === '') {
    errors.branch = 'Branch cannot be empty';
  } else if (
    !branches.value?.some(
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
    errors.url = 'Feature URL cannot be empty';
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
  Promise.all([fetchTestsBranches(), fetchFormsBranches()]);
});
</script>

<template>
  <form @submit.prevent="triggerPipeline">
    <fieldset>
      <legend>Branch:</legend>
      <input
        type="text"
        class="input"
        placeholder="Branch"
        list="branches"
        v-model="branch"
        @blur="validateBranch"
      />
      <datalist id="branches">
        <option v-for="branch in branches" :key="branch" :value="branch" />
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
</template>

<style scoped></style>
