<script setup>
import { useAppStore } from '@/stores/appStore.js';

const appStore = useAppStore();
const { buildInfo } = defineProps({
  buildInfo: {
    type: Object,
    required: true,
  },
});

const buildLink = `https://github.com/dyaroman/wla-e2e/_build/results?buildId=${buildInfo?.['buildId']}&view=results`;
const pipelineBranch = buildInfo?.['pipelineBranch']?.replace(
  'refs/heads/',
  '',
);
const gitLink = `https://github.com/dyaroman/wla-e2e/_git/wla-e2e?path=/&version=GB${pipelineBranch}`;

function normalizeFormsBranchText(branch) {
  let branchName = branch;
  branchName = branchName
    .replace(/https?:\/\//, '')
    .replace('example.com/', '');
  if (branchName.endsWith('/')) {
    branchName = branchName.slice(0, -1);
  }
  return branchName;
}

function normalizeFormsBranchLink(branch) {
  let branchLink = branch.trim();
  if (!branchLink.includes('example.com')) {
    branchLink = `example.com/${branchLink}`;
  }
  if (!/https?:\/\//.test(branchLink)) {
    branchLink = `https://${branchLink}`;
  }
  if (!branchLink.endsWith('/')) {
    branchLink = `${branchLink}/`;
  }
  return branchLink;
}
</script>

<template>
  <section class="build-info">
    <table>
      <thead>
        <tr>
          <th>Build</th>
          <th v-if="buildInfo['pipelineBranch']">Tests branch</th>
          <th v-if="buildInfo['formsUrl']">Forms branch</th>
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
          <td v-if="buildInfo['formsUrl']" data-title="Forms branch">
            <a
              :href="normalizeFormsBranchLink(buildInfo['formsUrl'])"
              target="_blank"
              rel="noopener noreferrer"
              >{{ normalizeFormsBranchText(buildInfo['formsUrl']) }}</a
            >
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
