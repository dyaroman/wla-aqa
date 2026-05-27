<script setup>
import { useAppStore } from '@/stores/appStore.js';

const appStore = useAppStore();
const { buildInfo } = defineProps({
  buildInfo: {
    type: Object,
    required: true,
  },
});

const buildLink = `https://github.com/dyaroman/wla-e2e/actions/runs/${buildInfo?.['buildId']}`;
const pipelineBranch = buildInfo?.['pipelineBranch']?.replace(
  'refs/heads/',
  '',
);
const gitLink = `https://github.com/dyaroman/wla-e2e/tree/${pipelineBranch}`;
</script>

<template>
  <section class="build-info">
    <table>
      <thead>
        <tr>
          <th>Build</th>
          <th v-if="buildInfo['pipelineBranch']">Tests branch</th>
          <th v-if="buildInfo['grep']">Tag</th>
          <th v-if="buildInfo['mode']">Mode</th>
          <th v-if="buildInfo['env']">Env</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-title="Build">
            <a :href="buildLink" target="_blank" rel="noopener noreferrer"
              >#{{ appStore.buildNumber }}</a
            >
          </td>
          <td v-if="buildInfo['pipelineBranch']" data-title="Tests branch">
            <a :href="gitLink" target="_blank" rel="noopener noreferrer">{{
              pipelineBranch
            }}</a>
          </td>
          <td v-if="buildInfo['grep']" data-title="Tag">
            {{ buildInfo['grep'] }}
          </td>
          <td v-if="buildInfo['mode']" data-title="Mode">
            {{ buildInfo['mode'] }}
          </td>
          <td v-if="buildInfo['env']" data-title="Env">
            {{ buildInfo['env'] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
