<script setup lang="ts">
import axios from 'axios'
import { type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const id: Ref<String> = ref<String>('test@test.com')
const password: Ref<String> = ref<String>('1234')

const onSubmit = async () => {
  try {
    const res = await axios.post('/member/login', {
      email: id.value,
      password: password.value
    })

    if (res.data === true) {
      router.push('/streaming') // Use Vue Router for navigation
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="outer-box">
    <h1 class="header">CCTV</h1>
    <div class="inner-box">
      <v-sheet width="300" class="mx-auto">
        <v-form @submit.prevent="onSubmit()">
          <v-text-field v-model="id" label="이메일을 입력하세요"></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="비밀번호를 입력하세요"
          ></v-text-field>
          <v-btn type="submit" block class="mt-2">로그인</v-btn>
        </v-form>
      </v-sheet>
    </div>
  </div>
</template>

<style scoped>
.outer-box {
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  width: 80vw; /* 뷰포트 너비 */
  max-height: 60vh; /* 뷰포트 높이 */
  flex-direction: column;
}

.header {
  margin-bottom: 30px;
  font-size: 80px; /* 기본 폰트 크기 */
  font-weight: bold;
}

/* 미디어 쿼리를 사용한 반응형 디자인 */
.inner-box {
  display: flex;
}
</style>
