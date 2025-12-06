<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="center-center">
      <el-result>
        <template #icon>
          <img src="~/assets/img/p-404.png" height="300" alt="">
        </template>
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">Back</el-button>
        </template>
      </el-result>
  </div>
</template>
